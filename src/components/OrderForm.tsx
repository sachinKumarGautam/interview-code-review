import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Order {
  productId: string;
  quantity: number;
}

const OrderForm: React.FC = () => {
  const [order, setOrder] = useState<Order>({ productId: "", quantity: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus("idle");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Order submitted:", order);
      setOrder({ productId: "", quantity: 0 });
      setSubmissionStatus("success");
    } catch (error) {
      console.error("Failed to submit order", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="productId">Product ID:</label>
        <input
          id="productId"
          value={order.productId}
          onChange={(e) => setOrder({ ...order, productId: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          value={order.quantity}
          onChange={(e) =>
            setOrder({
              ...order,
              quantity: parseInt(e.target.value, 10)
            })
          }
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Place Order"}
      </Button>
      {submissionStatus === "success" && <p>Order placed successfully!</p>}
      {submissionStatus === "error" && <p>Failed to place order.</p>}
    </form>
  );
};

export default OrderForm;
