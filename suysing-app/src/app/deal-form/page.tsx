"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import TermsAndConditions from "@/components/deal-form/TermsAndConditions";
import BasicForm from "@/components/deal-form/BasicForm";
import PickUpForm from "@/components/deal-form/PickUpForm";
import DeliveryForm from "@/components/deal-form/DeliveryForm";
import ProductSelection from "@/components/deal-form/ProductSelection";
import Confirmation from "@/components/deal-form/Confirmation";
import DealSubmitted from "@/components/deal-form/DealSubmitted";
import { useBooths } from "@/context/BoothsContext";

interface Product {
  id: string;
  itemCode: string;
  name: string;
  quantity: number;
  discount: string;
}

// Cart interface
interface Cart {
  id: string;
  customerCode: string;
  transactionType: string;
  branch: string;
  shipToAddress: string;
  remarks: string;
  selectedProducts: Product[];
  submitted?: boolean;
}

export default function DealFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { booths, handleVisitBooth, visitedCount, totalBooths } = useBooths();

  const [formData, setFormData] = useState({
    acceptTerms: false,
    customerCode: "",
    transactionType: "",
    branch: "",
    shipToAddress: "",
    remarks: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [carts, setCarts] = useState<Cart[]>([]);
  const [currentCartIndex, setCurrentCartIndex] = useState(0);

  useEffect(() => {
    if (step === 1) {
      setCarts([]);
      setCurrentCartIndex(0);
      setSelectedProducts([]);
      setFormData({
        acceptTerms: false,
        customerCode: "",
        transactionType: "",
        branch: "",
        shipToAddress: "",
        remarks: "",
      });

      localStorage.removeItem("dealformCarts");
    }

    if (carts.length === 0) {
      const emptyCart: Cart = {
        id: "CART1",
        customerCode: "",
        transactionType: "Pick up",
        branch: "",
        shipToAddress: "",
        remarks: "",
        selectedProducts: [],
      };
      setCarts([emptyCart]);
    }
  }, []);

  const handleCreateNewCart = (fromConfirmation = false) => {
    if (carts.length >= 3) {
      alert("Maximum of 3 carts allowed.");
      return;
    }

    if (fromConfirmation) {
      setStep(2);
    }

    if (carts.length > 0) {
      const updatedCarts = [...carts];

      updatedCarts[currentCartIndex] = {
        ...updatedCarts[currentCartIndex],
        customerCode: formData.customerCode,
        transactionType: formData.transactionType,
        branch: formData.branch,
        shipToAddress: formData.shipToAddress,
        remarks: formData.remarks,
        selectedProducts: selectedProducts,
      };
      setCarts(updatedCarts);

      localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));
    }

    const newCartId = `CART${carts.length + 1}`;

    const newCart: Cart = {
      id: newCartId,
      customerCode: "",
      transactionType: "Pick up",
      branch: "",
      shipToAddress: "",
      remarks: "",
      selectedProducts: [],
    };

    const updatedCarts = [...carts, newCart];
    setCarts(updatedCarts);
    setCurrentCartIndex(carts.length);

    // Save updated carts to localStorage
    localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));

    // Reset form data for the new cart
    setFormData({
      acceptTerms: formData.acceptTerms,
      customerCode: "",
      transactionType: "Pick up",
      branch: "",
      shipToAddress: "",
      remarks: "",
    });

    setSelectedProducts([]);
  };

  const handleNavigateCart = (direction: "prev" | "next") => {
    const updatedCarts = [...carts];
    updatedCarts[currentCartIndex] = {
      ...updatedCarts[currentCartIndex],
      customerCode: formData.customerCode,
      transactionType: formData.transactionType,
      branch: formData.branch,
      shipToAddress: formData.shipToAddress,
      remarks: formData.remarks,
      selectedProducts: selectedProducts,
    };
    setCarts(updatedCarts);

    // Save to localStorage
    localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));

    const newIndex =
      direction === "prev" ? currentCartIndex - 1 : currentCartIndex + 1;

    if (newIndex >= 0 && newIndex < carts.length) {
      setCurrentCartIndex(newIndex);

      // Get the selected cart's data
      const selectedCart = updatedCarts[newIndex];

      // Update form data with the selected cart's data
      setFormData({
        ...formData,
        customerCode: selectedCart.customerCode,
        transactionType: selectedCart.transactionType || "Pick up",
        branch: selectedCart.branch || "",
        shipToAddress: selectedCart.shipToAddress || "",
        remarks: selectedCart.remarks || "",
      });

      console.log(
        "Loading products for cart",
        newIndex,
        selectedCart.selectedProducts
      );
      setSelectedProducts(selectedCart.selectedProducts || []);
    }
  };

  const handleUpdateCart = (cartIndex: number, products: Product[]) => {
    if (cartIndex >= 0 && cartIndex < carts.length) {
      const updatedCarts = [...carts];
      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        selectedProducts: products,
      };
      setCarts(updatedCarts);
      setSelectedProducts(products);

      console.log("Updated products for cart", cartIndex, products);

      localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step === 1 && !formData.acceptTerms) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    if (step === 2 && (!formData.customerCode || !formData.transactionType)) {
      alert("Please fill in all required fields.");
      return;
    }

    if (step === 3) {
      if (formData.transactionType === "Pick up" && !formData.branch) {
        alert("Please select a branch.");
        return;
      }
      if (formData.transactionType === "Delivery" && !formData.shipToAddress) {
        alert("Please enter a shipping address.");
        return;
      }
    }

    if (step === 3 && carts.length === 0) {
      const firstCart: Cart = {
        id: "CART1",
        customerCode: formData.customerCode,
        transactionType: formData.transactionType,
        branch: formData.branch,
        shipToAddress: formData.shipToAddress,
        remarks: formData.remarks,
        selectedProducts: [],
      };
      setCarts([firstCart]);

      // Save to localStorage
      localStorage.setItem("dealformCarts", JSON.stringify([firstCart]));
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      // Show the submission modal
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle form submission and booth visit tracking
  const handleComplete = () => {
    const updatedCarts = [...carts];

    const existingProducts =
      updatedCarts[currentCartIndex]?.selectedProducts || [];

    updatedCarts[currentCartIndex] = {
      ...updatedCarts[currentCartIndex],
      customerCode: formData.customerCode,
      transactionType: formData.transactionType,
      branch: formData.branch,
      shipToAddress: formData.shipToAddress,
      remarks: formData.remarks,
      selectedProducts: existingProducts,
      submitted: true,
    };
    setCarts(updatedCarts);

    // Save to localStorage
    localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));

    console.log("Form submitted for cart:", updatedCarts[currentCartIndex]);
    console.log(
      "Selected products:",
      updatedCarts[currentCartIndex]?.selectedProducts
    );

    existingProducts.forEach((product) => {
      if (product.quantity > 0) {
        const productCode = product.itemCode.toLowerCase();
        const matchingBooth = booths.find(
          (booth) =>
            (booth.name && booth.name.toLowerCase().includes(productCode)) ||
            (booth.id && booth.id.toLowerCase().includes(productCode))
        );

        if (matchingBooth && matchingBooth.id && !matchingBooth.visited) {
          handleVisitBooth(matchingBooth.id);
        }
      }
    });

    const remainingUnsubmittedCarts = updatedCarts.filter(
      (cart) => !cart.submitted
    );

    if (remainingUnsubmittedCarts.length > 0) {
      const nextUnsubmittedIndex = updatedCarts.findIndex(
        (cart) => !cart.submitted
      );
      if (nextUnsubmittedIndex !== -1) {
        setCurrentCartIndex(nextUnsubmittedIndex);
        return;
      }
    }

    localStorage.removeItem("dealformCarts");

    setShowSubmitModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowSubmitModal(false);
    // Reset form
    setFormData({
      acceptTerms: false,
      customerCode: "",
      transactionType: "",
      branch: "",
      shipToAddress: "",
      remarks: "",
    });
    setCarts([]);
    setCurrentCartIndex(0);
    setStep(1);
    router.push("/");
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto min-h-screen">
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-16">
        {step === 4 || step === 5 ? (
          <div className="flex justify-center mb-6">
            <Image
              src="/images/epic-journey.png"
              alt="Epic Journey to Success"
              width={150}
              height={150}
              priority
            />
          </div>
        ) : (
          <BoothsProgress
            visited={visitedCount}
            total={totalBooths}
            viewList=" Tap to view the list of visited and unvisited booths."
          />
        )}

        <div className="mt-6">
          {step === 1 && (
            <TermsAndConditions
              acceptTerms={formData.acceptTerms}
              onCheckboxChange={handleCheckboxChange}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <BasicForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
            />
          )}

          {step === 3 && formData.transactionType === "Pick up" && (
            <PickUpForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              branch={formData.branch}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
            />
          )}

          {step === 3 && formData.transactionType === "Delivery" && (
            <DeliveryForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              shipToAddress={formData.shipToAddress}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
            />
          )}

          {step === 4 && (
            <ProductSelection
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              branch={formData.branch}
              shipToAddress={formData.shipToAddress}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentCartIndex={currentCartIndex}
              carts={carts}
              onCreateNewCart={handleCreateNewCart}
              maxCartsReached={carts.length >= 3}
              onUpdateCart={handleUpdateCart}
              onNavigateCart={handleNavigateCart}
            />
          )}

          {step === 5 && (
            <Confirmation
              formData={{
                ...formData,
                selectedProducts:
                  carts[currentCartIndex]?.selectedProducts || [],
              }}
              onSubmit={handleComplete}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              carts={carts}
              currentCartIndex={currentCartIndex}
              onNavigateCart={handleNavigateCart}
              onCreateNewCart={() => handleCreateNewCart(true)}
              maxCartsReached={carts.length >= 3}
            />
          )}
        </div>
      </main>

      {/* Deal Submitted Modal */}
      <DealSubmitted isOpen={showSubmitModal} onClose={handleCloseModal} />
    </div>
  );
}
