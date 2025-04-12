"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BoothsProgress from "@/components/BoothsProgress";
import TermsAndConditions from "@/components/deal-form/TermsAndConditions";
import BasicForm from "@/components/deal-form/BasicForm";
import PickUpForm from "@/components/deal-form/PickUpForm";
import DeliveryForm from "@/components/deal-form/DeliveryForm";
import ProductSelection from "@/components/deal-form/ProductSelection";
import Confirmation from "@/components/deal-form/Confirmation";
import DealSubmitted from "@/components/deal-form/DealSubmitted";
import Swal from 'sweetalert2';
import { useBooths } from "@/context/BoothsContext";
import { dealCartService, boothVisitService } from '@/services/api';

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

interface CustomerData {
  id: string;
  fname: string;
  customer_type: string;
  code: string;
}

interface CustomerPickupDetails {
  id: string;
  cp_type: string;
  branch_code: string;
}

interface CustomerDeliveryDetails {
  id: string;
  code: string;
  ship_to_id: string;
  cd_type: string;
  branch_code: string;
  address: string;
}

export default function DealFormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { booths, handleVisitBooth, visitedCount, totalBooths } = useBooths();

  const [formData, setFormData] = useState({
    acceptTerms: false,
    customerCode: "",
    transactionType: "Pick up",
    branch: "",
    shipToAddress: "",
    remarks: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [carts, setCarts] = useState<Cart[]>([]);
  const [currentCartIndex, setCurrentCartIndex] = useState(0);
  const [customerDetails, setCustomerDetails] = useState<CustomerData>();
  const [customerData, setCustomerData] = useState<{
    id: number;
    code: string;
    name: string;
    hasVoted?: number;
    isDoneVisit?: number;
    totalBoothVisited?: number;
    totalBooths?: number;
  } | null>(null);
  const [customerPickupDetails, setCustomerPickupDetails] = useState<CustomerPickupDetails[]>([]);
  const [customerDeliveryDetails, setCustomerDeliveryDetails] = useState<CustomerDeliveryDetails[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [boothProducts, setBoothProducts] = useState([]);
  const [isRender, setIsRender] = useState(false);


  const searchParams = useSearchParams();
  const customer_hash_code = searchParams.get("cc");
  
  let stored_hash_code: any = ""
  if (typeof window !== 'undefined') {
    stored_hash_code = localStorage.getItem('hash_code');
  }

  
  const getCustomerRecord = async () => {
    try {
      const customerResult = await boothVisitService.getCustomerRecord();
      
      if(customerResult.success){

        const mapCustomerData = {
          id: customerResult.results?.id,
          code: customerResult.results?.code,
          name: customerResult.results?.full_name,
          hasVoted: customerResult.results?.is_done_voting,
          isDoneVisit: customerResult.results?.is_done_visit,
          totalBooths: customerResult.results?.total_booths,
          totalBoothVisited: customerResult.results?.total_booth_visited,
        };
        
        setCustomerData(mapCustomerData);
      
        return true;
      }else{

        return false;
      }
    
    } catch (error) {
      
      return false;
      
    }

  };

  const getCustomerParams = async () => {
    try {

      const customerResult = await dealCartService.getCustomerParams();
      
      if(customerResult.success){
        setCustomerDetails(customerResult.results);
        setFormData({
          ...formData,
          customerCode: customerResult.results.code || ""
        });
        
        const pickUpResults = customerResult.results?.pickup || [];
        const deliveryResults = customerResult.results?.delivery || [];

        if(pickUpResults.length > 0){
          setTransactionTypes(prev =>
            prev.includes('Pick up') ? prev : [...prev, 'Pick up']
          );
        }
        if(deliveryResults.length > 0){
          setTransactionTypes(prev =>
            prev.includes('Delivery') ? prev : [...prev, 'Delivery']
          );
        }

        setCustomerPickupDetails(pickUpResults);
        setCustomerDeliveryDetails(deliveryResults);
      }
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const getBoothProducts = async () => {
    try {
      const customerResult = await dealCartService.getBoothProducts();
      
      if(customerResult.success){ 
        setBoothProducts(customerResult.results || [])
        return true;
      }else{

        return false;
      }
    
    } catch (error) {
      
      return false;
      
    }

  };


  const createDealCart = async (post_data : any) => {
    try {
      const createDealCartResult = await dealCartService.createDealCart(post_data);
      console.log(createDealCartResult)
      if(createDealCartResult.success){
        return true;
      }else{
        showMessage("0" , createDealCartResult.message)  
        return false;
      }
    
    } catch (error) {
      console.log(error)
      console.log(error)
      showMessage("0" , "Unable to process your request. Please try again later. 1212 ")   
      return false;
      
    }

  };

  useEffect(() => {

    if(customer_hash_code && stored_hash_code){
      if(customer_hash_code == stored_hash_code){
        setIsRender(true)
      }
    }

    getCustomerRecord()
    getCustomerParams()
    getBoothProducts()

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
    
    const updatedCarts = [...carts];

    if (carts.length > 0) {
      // const updatedCarts = [...carts];

      updatedCarts[currentCartIndex] = {
        ...updatedCarts[currentCartIndex],
        customerCode: formData.customerCode,
        transactionType: formData.transactionType,
        branch: formData.branch,
        shipToAddress: formData.shipToAddress,
        remarks: formData.remarks,
        selectedProducts: selectedProducts,
      };
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
    const updatedCartsFinal = [...updatedCarts, newCart];

    setCarts(updatedCartsFinal);
    setCurrentCartIndex(carts.length);

    // Save updated carts to localStorage
    localStorage.setItem("dealformCarts", JSON.stringify(updatedCartsFinal));

    // Reset form data for the new cart
    setFormData({
      acceptTerms: formData.acceptTerms,
      customerCode: formData.customerCode,
      transactionType: formData.transactionType,
      branch: formData.branch,
      shipToAddress: formData.shipToAddress,
      remarks: formData.remarks,
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

      // remove product quantity == 0
      const updatedProducts =  products.filter((product) => product.quantity != 0);
  
      if (cartIndex >= 0 && cartIndex < carts.length) {
      const updatedCarts = [...carts];
      const cartProducts = updatedCarts[cartIndex].selectedProducts;

      // remap cart products
      const remapCartProducts = cartProducts.map((cartProduct) => {
        const findUpdatedProduct = updatedProducts.find(updatedProduct => updatedProduct.id == cartProduct.id);

        // find and update cart product quantity if exist in updatedProducts
        if(findUpdatedProduct){
          const findUpdateProductIndex = updatedProducts.findIndex(updatedProduct => updatedProduct.id === findUpdatedProduct.id);

          // remove product on updatedProducts array
          if (findUpdateProductIndex !== -1) {
            updatedProducts.splice(findUpdateProductIndex, 1);  // Removes 1 item at the found index
          }
          return {...cartProduct, quantity : findUpdatedProduct.quantity}
        }else{
          return {...cartProduct}
        }
        
      });

      // Merge remapCartProducts and updatedProducts
      const finalCartProducts = [...remapCartProducts, ...updatedProducts]


      updatedCarts[cartIndex] = {
        ...updatedCarts[cartIndex],
        selectedProducts: finalCartProducts, //
      };
      setCarts(updatedCarts);
      setSelectedProducts(finalCartProducts);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransactionTypeChange = (type: string) => {
    setFormData({ ...formData, transactionType: type });
  };

  const handleBranchChange = (branch: string) => {
    setFormData({ ...formData, branch });
  };

  const handleShipToAddressChange = (address: string) => {
    setFormData({ ...formData, shipToAddress: address });
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

    if (step === 1) {
      // Clear dealformCarts after accepting t and c
      localStorage.removeItem("dealformCarts");
    }

    if (step === 2) {
      if (formData.transactionType === "Pick up" && !formData.branch) {
        alert("Please select a branch.");
        return;
      }
      if (formData.transactionType === "Delivery" && !formData.shipToAddress) {
        alert("Please enter a shipping address.");
        return;
      }
    }

    if (step === 4 && carts.length === 0) {
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

    if (step < 4) {
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
  const handleComplete = async () => {
    const updatedCarts = [...carts];
    
    // check if cart is already submmitted
    if(updatedCarts[currentCartIndex]){
      if(updatedCarts[currentCartIndex].submitted){
        showMessage("0", "You already submmited this cart.")
        return;
      }
    }

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
    };
    setCarts(updatedCarts);

    // Save to localStorage
    localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));

    console.log("Form submitted for cart:", updatedCarts[currentCartIndex]);
    console.log(
      "Selected products:",
      updatedCarts[currentCartIndex]?.selectedProducts
    );
    
    
    const submitCart = await createDealCart(updatedCarts[currentCartIndex]);

    if(submitCart){

      // tag the cart as submiited if api response is sucessfull
      updatedCarts[currentCartIndex] = {
        ...updatedCarts[currentCartIndex],
        submitted: true,
      };
      setCarts(updatedCarts);
      // Save to localStorage
      localStorage.setItem("dealformCarts", JSON.stringify(updatedCarts));

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
          showMessage("1", "Deal form submitted.")
          // setCurrentCartIndex(nextUnsubmittedIndex);
          return;
        }
      }

      localStorage.removeItem("dealformCarts");

      setShowSubmitModal(true);
      return;

    }
    

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
    router.push(`/?cc=${stored_hash_code}`);
  };

  const showMessage = (status: string, message : string)  => {
    
    let iconType: "success" | "error";
    let titleType: "Success" | "Error";

    if(status == "1"){
      iconType = "success";
      titleType = "Success";
    }else{
      iconType = "error";
      titleType = "Error";
    }

    Swal.fire({
      title: titleType,
      text: message,
      icon: iconType,
      confirmButtonColor: "#F78B1E"
    })
  }

  if(!isRender){
    return null;
  }

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
            visited={customerData?.totalBoothVisited || 0}
            total={customerData?.totalBooths || 0}
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

          {/* {step === 2 && (
            <BasicForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
            />
          )} */}

          {step === 2 && (formData.transactionType === "Pick up" || formData.transactionType === "") && (
            <PickUpForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              branch={formData.branch}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
              transactionTypes={transactionTypes}
              customerPickupDetails={customerPickupDetails}
            />
          )}

          {step === 2 && formData.transactionType === "Delivery" && (
            <DeliveryForm
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              shipToAddress={formData.shipToAddress}
              remarks={formData.remarks}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onNext={handleNext}
              transactionTypes={transactionTypes}
              customerDeliveryDetails={customerDeliveryDetails}
            />
          )}
          {step === 3 && (
            <ProductSelection
              customerCode={formData.customerCode}
              transactionType={formData.transactionType}
              branch={
                customerPickupDetails.find(
                  cpd => cpd.id == formData.branch
                )?.branch_code || formData.branch
              }
              shipToAddress={
                customerDeliveryDetails.find(
                  cdd => cdd.id == formData.shipToAddress
                )?.address || formData.shipToAddress
              }
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentCartIndex={currentCartIndex}
              carts={carts}
              onCreateNewCart={handleCreateNewCart}
              maxCartsReached={carts.length >= 3}
              onUpdateCart={handleUpdateCart}
              onNavigateCart={handleNavigateCart}
              onTransactionTypeChange={handleTransactionTypeChange}
              onBranchChange={handleBranchChange}
              onShipToAddressChange={handleShipToAddressChange}
              boothProducts={boothProducts}
              transactionTypes={transactionTypes}
              customerPickupDetails={customerPickupDetails}
              customerDeliveryDetails={customerDeliveryDetails}
            />
          )}

          {step === 4 && (
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
              transactionTypes={transactionTypes}
              customerPickupDetails={customerPickupDetails}
              branch={
                customerPickupDetails.find(
                  cpd => cpd.id == formData.branch
                )?.branch_code || formData.branch
              }
              shipToAddress={
                customerDeliveryDetails.find(
                  cdd => cdd.id == formData.shipToAddress
                )?.address || formData.shipToAddress
              }
              customerDeliveryDetails={customerDeliveryDetails}
              shipToAddressId={formData.shipToAddress}
              branchId={formData.branch}
            />
          )}
        </div>
      </main>

      {/* Deal Submitted Modal */}
      <DealSubmitted isOpen={showSubmitModal} onClose={handleCloseModal} />
    </div>
  );
}
