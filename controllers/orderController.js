import Order from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req, res) {
	if (req.user == null) {
		res.status(403).json({
			message: "Please login and try again",
		});
		return;
	}

	const orderInfo = req.body;

	if (orderInfo.name == null) {
		orderInfo.name = req.user.firstName + " " + req.user.lastName;
	}

	//STS00001
	let orderId = "STS00001";

	const lastOrder = await Order.find().sort({ date: -1 }).limit(1);
	//[]
	if (lastOrder.length > 0) {
		const lastOrderId = lastOrder[0].orderId; //"STS00551"

		const lastOrderNumberString = lastOrderId.replace("STS", ""); //"00551"
		const lastOrderNumber = parseInt(lastOrderNumberString); //551
		const newOrderNumber = lastOrderNumber + 1; //552
		const newOrderNumberString = String(newOrderNumber).padStart(5, "0");
		orderId = "STS" + newOrderNumberString; //"STS00552"
	}
	try {
		let total = 0;
		let labelledTotal = 0;
		const products = [];

		for (let i = 0; i < orderInfo.products.length; i++) {
			const item = await Product.findOne({
				productId: orderInfo.products[i].productId,
			});
			if (item == null) {
				res.status(404).json({
					message:
						"Product with productId " +
						orderInfo.products[i].productId +
						" not found",
				});
				return;
			}
			if (item.isAvailable == false) {
				res.status(404).json({
					message:
						"Product with productId " +
						orderInfo.products[i].productId +
						" is not available right now!",
				});
				return;
			}
			
			// Get quantity from request (use qty or quantity field)
			const quantity = orderInfo.products[i].qty || orderInfo.products[i].quantity;
			
			// Validate quantity
			// if (!quantity || isNaN(quantity) || quantity <= 0) {
			// 	res.status(400).json({
			// 		message: "Invalid quantity for product " + orderInfo.products[i].productId,
			// 	});
			// 	return;
			// }
			
			// Match Product schema field names
			products[i] = {
    productInfo: {
        productId: item.productId,
        name: item.productName,
        altNames: item.altNames,
        images: item.imgUrls,
        labeledPrice: item.labeledPrice,
        price: item.sellingPrice,
        quantity: quantity,
    }
};
			//total = total + (item.price * orderInfo.products[i].quantity)
			total += item.sellingPrice * quantity;  // Changed from item.price to item.sellingPrice
			//labelledTotal = labelledTotal + (item.labelledPrice * orderInfo.products[i].quantity)
			labelledTotal += item.labeledPrice * quantity;  // Changed from item.labelledPrice to item.labeledPrice
		}

		// Check if total is valid
		// if (isNaN(total)) {
		// 	res.status(400).json({
		// 		message: "Invalid total amount calculated",
		// 	});
		// 	return;
		// }

		const order = new Order({
			orderId: orderId,
			email: req.user.email,
			name: orderInfo.name,
			address: orderInfo.address,
			phone: orderInfo.phone,
			products: products,
			labelledTotal: labelledTotal,
			total: total,
			status: "pending",
		});
		const createdOrder = await order.save();
		res.json({
			message: "Order created successfully",
			order: createdOrder,
		});
	} catch (err) {
		res.status(500).json({
			message: "Failed to create order",
			error: err,
		});
	}
}

export async function getOrders(req, res) {
	if (req.user == null) {
		res.status(403).json({
			message: "Please login and try again",
		});
		return;
	}

	try {
		if (req.user.role == "admin") {
			const orders = await Order.find();
			res.json({
				message: "Orders retrieved successfully",
				orders: orders,
			});
		} else {
			const orders = await Order.find({ email: req.user.email });
			res.json({
				message: "Orders retrieved successfully",
				orders: orders,
			});
		}
	} catch (err) {
		res.status(500).json({
			message: "Failed to retrieve orders",
			error: err,
		});
	}
}

export async function deleteOrder(req, res) {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.findByIdAndDelete(orderId);

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
	