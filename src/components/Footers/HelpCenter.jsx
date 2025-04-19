import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../homepage/Navbar";
import { HeroBanner } from "../homepage/HeroBanner";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import { FaBox, FaCreditCard, FaQuestionCircle, FaRedo, FaTruck } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

// Modal content mapping for each help topic
const modalContentMap = {
  "Item not delivered": {
    title: "Item Not Delivered",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">If your item has not arrived by the expected delivery date, follow these steps:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Log in to your account dashboard.</li>
          <li>Go to the "My Orders" section.</li>
          <li>Locate your order using the Order ID.</li>
          <li>Click on the "Track Order" button to check the status.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Need help finding your Order ID? Check your User Dashboard.</p>
        </div>
      </div>
    )
  },

  "Item marked as delivered but not received": {
    title: "Item Marked as Delivered but Not Received",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If your order status shows as "Delivered" but you haven't received it, follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Check with household members or neighbors to see if they accepted the package on your behalf.</li>
          <li>Look around your delivery location, including mailrooms, porches, or secure drop-off spots.</li>
          <li>Verify the shipping address on your order confirmation.</li>
          <li>Contact the delivery carrier with your tracking number for more details.</li>
          <li>If you still can't locate your package, reach out to our customer support team for further assistance.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need help? Contact our support team via chat or email for further assistance.
          </p>
        </div>
      </div>
    )
  },
  "Item delivered to the wrong address": {
    title: "Item Delivered to the Wrong Address",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If your order was delivered to the wrong address, follow these steps to resolve the issue:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Double-check the shipping address on your order confirmation.</li>
          <li>Check with neighbors or nearby locations to see if the package was misdelivered.</li>
          <li>Contact the delivery carrier using your tracking number to report the issue.</li>
          <li>Reach out to our customer support team with your order details for further assistance.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need help? Contact our support team via chat or email to resolve your issue quickly.
          </p>
        </div>
      </div>
    )
  },
  "Late delivery": {
    title: "Late Delivery",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If your package has not arrived by the expected delivery date, follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Track your order using the tracking number provided.</li>
          <li>Verify if there are any carrier delays due to weather or other factors.</li>
          <li>Wait an additional 1-2 business days, as deliveries may be delayed.</li>
          <li>If your order is still not delivered, contact our support team for assistance.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need help? Contact our support team via chat or email to resolve your issue.
          </p>
        </div>
      </div>
    )
  },

  "Item different from the order": {
    title: "Item Different from the Order",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If you received an item that is different from what you ordered, follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Check the product packaging and labels for any discrepancies.</li>
          <li>Take clear photos of the received item and keep the original packaging.</li>
          <li>Contact our support team with your order number and photos to report the issue.</li>
          <li>Wait for further instructions regarding return or replacement.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need assistance? Reach out to our support team for a quick resolution.
          </p>
        </div>
      </div>
    )
  },

  "Double Charge": {
    title: "Double Charge",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If you were charged twice for your order, please follow these steps to resolve the issue:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Check your bank or payment provider to confirm both charges.</li>
          <li>Ensure that one charge is not a temporary authorization (this usually disappears within 3-5 business days).</li>
          <li>If both charges remain after 5 days, contact our support team with your order details.</li>
          <li>Provide a screenshot or statement showing the duplicate charges.</li>
          <li>We will verify the transaction and issue a refund if necessary.</li>
        </ol>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Note: Refunds for duplicate charges typically process within 3-7 business days.
          </p>
        </div>
      </div>
    )
  },

  "Defective item": {
    title: "Defective Item",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If you received a defective or damaged item, follow these steps to request a replacement or refund:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Inspect the item for visible damage or defects upon arrival.</li>
          <li>Take clear photos of the defective item and its packaging.</li>
          <li>Check if the item is covered under our return and warranty policy.</li>
          <li>Contact our support team with your order details and photos.</li>
          <li>Follow the instructions provided for returning the defective item.</li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Need help? Our support team is available to assist you with your replacement or refund request.
          </p>
        </div>
      </div>
    )
  },

  "Damaged item": {
    title: "Damaged Item",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If you received a damaged item, please follow these steps to report it and request a replacement or refund:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Inspect the item for any visible damage upon delivery.</li>
          <li>Take clear photos of the damaged item and packaging.</li>
          <li>Check our return policy to ensure the item is eligible for a return.</li>
          <li>Contact our customer support team with your order details and photos.</li>
          <li>Follow the instructions provided for returning the damaged item.</li>
        </ol>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Tip: Report the damage within 48 hours of delivery for a faster resolution.
          </p>
        </div>
      </div>
    )
  },

  "Missing parts": {
    title: "Missing Parts",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          If your item arrived with missing parts, follow these steps to request a replacement or resolve the issue:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Check the packaging and box thoroughly for any hidden parts.</li>
          <li>Review the product manual to confirm all included parts.</li>
          <li>Take clear photos of the received items and packaging.</li>
          <li>Contact our support team with your order details and missing part information.</li>
          <li>We'll arrange for a replacement part or provide further assistance.</li>
        </ol>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            Tip: Reporting missing parts within 7 days of delivery ensures a quicker resolution.
          </p>
        </div>
      </div>
    )
  },
  "Payment Not Accepted": {
    title: "Payment Not Accepted",
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Why Was My Payment Declined?</h3>
        <p className="text-gray-700">
          Your payment may have been declined for one of the following reasons:
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Insufficient funds in your account</li>
          <li>Incorrect card details (number, expiration, or CVV)</li>
          <li>Bank restrictions on online transactions</li>
          <li>Card expired or not activated for e-commerce</li>
          <li>Technical issues with the payment gateway</li>
          <li>International transactions not enabled for your card</li>
          <li className="text-red-600 font-medium">Only Dahabi Card is accepted for this transaction</li>
        </ul>

        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">
            Tip: Contact your bank for more details or try using an alternative payment method.
          </p>
        </div>
      </div>
    )
  },

  "Refund not received": {
    title: "Refund not received",
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Why Haven't I Received My Refund?</h3>
        <p className="text-gray-700">
          If your refund has not been credited yet, it may still be in process. Below are the expected timelines:
        </p>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-[#5A3ECB] mb-2">Return Shipping</h4>
            <p className="text-gray-700">It takes 3-5 business days for the item to reach our warehouse.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-[#5A3ECB] mb-2">Refund Processing</h4>
            <p className="text-gray-700">1-2 business days for item inspection</p>
            <p className="text-gray-700">24 hours for refund initiation</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-[#5A3ECB] mb-2">Bank Processing Time</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Credit Cards: 3-5 business days</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  "Return Request": {
    title: "Return Request for Product",
    content: (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to Request a Return</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              For further assistance, go to your <strong>Dashboard</strong> → <strong>Messages</strong>,
              and send a message to the <strong>Admin</strong> or <strong>Customer Help Center</strong>.
            </li>
          </ol>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 border rounded-lg">
            <h4 className="font-medium text-[#5A3ECB]">Return Policy</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Items must be returned within 3 days of delivery</li>
              <li>Products should be in original condition with tags</li>
              <li>Some items (e.g., perishables, personalized goods) are non-returnable</li>
              <li>Return shipping labels will be provided</li>
              <li>Refunds are processed within 5-7 business days after approval</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Note: If your return request is approved, you will receive an email with further instructions.
          </p>
        </div>
      </div>
    )
  },

"Refund not received after return": {
  title: "Refund not received after return",
  content: (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Refund Processing Steps</h3>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium text-[#5A3ECB] mb-2">Return Shipment</h4>
          <p className="text-gray-700">Ensure your returned item has reached our warehouse. Processing typically takes 3-5 business days.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium text-[#5A3ECB] mb-2">Refund Processing Time</h4>
          <ul className="list-disc list-inside text-gray-700">
            <li>Inspection & approval: 1-2 business days</li>
            <li>Refund initiation: Within 24 hours of approval</li>
            <li>Bank processing time:
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Credit Card: 3-5 business days</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium text-[#5A3ECB] mb-2">What to Do If Refund Is Delayed?</h4>
          <ul className="list-disc list-inside text-gray-700">
            <li>Check your bank or payment provider for any pending transactions.</li>
            <li>If it's been longer than the expected processing time, contact us.</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">Still need help? Go to your <strong>Dashboard</strong> → <strong>Messages</strong> and contact <strong>Admin</strong> or <strong>Customer Help Center</strong>.</p>
      </div>
    </div>
  )
},

"Problem with the return label": {
  title: "Problem with the return label",
  content: (
    <div className="space-y-4">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Return Label Issues</h3>
        <p className="text-gray-700">
          If your return label is missing or has any issues, follow these steps:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
          <li>Ensure the product qualifies for a return</li>
          <li>Make sure the label is clear and scannable</li>
          <li>If the label is missing or incorrect, contact support</li>
        </ul>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          Go to <strong>Dashboard</strong> → <strong>Messages</strong> → Contact <strong>Admin </strong>  
          or email us at <strong>cebleu@contact.com</strong>.
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Uploading Evidence</h4>
        <p className="text-gray-700">
          If your return label is missing or incorrect, please provide evidence to support your claim.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
          <li>Attach photos or screenshots of the issue</li>
          <li>Include your order details</li>
          <li>Send the information via email to <strong>cebleu@contact.com</strong></li>
        </ul>
      </div>
    </div>
  )
},


 "Problem with the seller": {
  title: "Problem with the seller",
  content: (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Issues with Seller Communication</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Use the platform's messaging system for all communication</li>
          <li>Keep records of messages and agreements</li>
          <li>If unresolved, escalate the dispute</li>
        </ul>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Report & Escalate</h4>
        <ul className="list-disc list-inside space-y-2 text-yellow-800">
          <li>Go to <strong>Dashboard</strong> → <strong>Messages</strong> → Contact <strong>Admin</strong></li>
          <li>Email us at <strong>cebleu@contact.com</strong></li>
        </ul>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Submit Evidence</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Attach screenshots of conversations</li>
          <li>Provide order details & proof of agreement</li>
          <li>Email supporting documents to <strong>cebleu@contact.com</strong></li>
        </ul>
      </div>
    </div>
  )
},

"Technical problem": {
  title: "Technical problem",
  content: (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Website Support & Troubleshooting</h3>

      <div className="p-4 border rounded-lg">
        <h4 className="font-medium text-[#5A3ECB] mb-2">Loading & Access Issues</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Check your internet connection</li>
          <li>Clear browser cache & cookies</li>
          <li>Disable browser extensions</li>
          <li>Try a different browser or device</li>
        </ul>
      </div>

      <div className="p-4 border rounded-lg">
        <h4 className="font-medium text-[#5A3ECB] mb-2">Common Website Problems</h4>
        <p className="font-medium text-gray-700">Page Not Loading:</p>
        <ul className="list-disc list-inside ml-2 text-gray-600">
          <li>Refresh the page</li>
          <li>Ensure the website is not down</li>
          <li>Disable VPN or proxy</li>
        </ul>
        <p className="font-medium text-gray-700 mt-3">Login Issues:</p>
        <ul className="list-disc list-inside ml-2 text-gray-600">
          <li>Check your credentials</li>
          <li>Reset your password</li>
          <li>Ensure cookies are enabled</li>
        </ul>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Browser Compatibility</h4>
        <ul className="list-disc list-inside text-blue-700">
          <li><strong>Recommended:</strong> Chrome, Firefox, Edge</li>
          <li><strong>Ensure:</strong> JavaScript & cookies are enabled</li>
          <li><strong>Update:</strong> Your browser to the latest version</li>
        </ul>
      </div>

      <div className="p-4 bg-green-50 rounded-lg text-sm text-green-800">
        Keep your browser updated for the best website experience!
      </div>
    </div>
  )
},

 "Other": {
  title: "Other",
  content: (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Need Help with Something Else?</h3>
        <p className="text-gray-700">
          If your issue isn't covered in the previous sections, our support team is here to assist you. 
          Please provide as much detail as possible to help us resolve your request efficiently.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-[#5A3ECB]">How to Contact Support</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="p-3 border rounded-lg">
            <h5 className="font-medium text-gray-800">Submit a Request</h5>
            <ul className="list-disc list-inside text-gray-700">
              <li>Visit our <strong>Support Center</strong></li>
              <li>Fill out the contact form with your query</li>
              <li>Provide necessary details (screenshots, descriptions, etc.)</li>
            </ul>
          </div>

          <div className="p-3 border rounded-lg">
            <h5 className="font-medium text-gray-800">Direct Contact</h5>
            <ul className="list-disc list-inside text-gray-700">
              <li>Email: <strong>cebleu@contact.com</strong></li>
              <li>Live Chat: Available during business hours</li>
              <li>Community Forum: Join discussions & get help from other users</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Escalating an Issue</h4>
        <p className="text-blue-700">
          If you need urgent assistance or escalation, please contact our <strong>Admin Team</strong> directly through the support portal.
        </p>
      </div>

      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          We appreciate your patience and will get back to you as soon as possible!
        </p>
      </div>
    </div>
  )
},
};

const helpCategories = [
  { 
    title: "Delivery Problem", 
    icon: <FaTruck className="text-blue-500" />, 
    links: ["Item not delivered", "Item marked as delivered but not received", "Item delivered to the wrong address", "Late delivery"] 
  },
  { 
    title: "Problem with the Item", 
    icon: <FaBox className="text-green-500" />, 
    links: ["Item different from the order", "Defective item", "Damaged item", "Missing parts"] 
  },
  { 
    title: "Payment Issue", 
    icon: <FaCreditCard className="text-red-500" />, 
    links: ["Double Charge", "Payment Not Accepted", "Refund not received"] 
  },
  { 
    title: "Return & Refund", 
    icon: <FaRedo className="text-purple-500" />, 
    links: ["Return Request", "Refund not received after return", "Problem with the return label"] 
  },
  { 
    title: "Other Problem", 
    icon: <FaQuestionCircle className="text-gray-500" />, 
    links: ["Problem with the seller", "Technical problem", "Other"] 
  }
];


export default function HelpCenter() {
  const [translatedModalContent, setTranslatedModalContent] = useState(null);
  const [translatedHelpCategories, setTranslatedHelpCategories] = useState([]);
  
  const { selectedLanguage, translateText } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    helpCenterTitle: "Help Center",
    helpSubtitle: "How can we assist you today?",
    stillNeedHelp: "Still Need Help?",
    supportText: "Our support team is available 24/7 to assist you with any questions or concerns.",
    contactSupport: "Contact Support",
    defaultModalTitle: "Help Information",
    defaultModalText: "Information about this topic will be available soon.",
    immediateAssistance: "For immediate assistance, please contact our support team."
  });

  const [translationMap, setTranslationMap] = useState({});
    // Translate static content
    useEffect(() => {
      const translateStaticContent = async () => {
        const translations = await Promise.all([
          translateText("Help Center"),
          translateText("How can we assist you today?"),
          translateText("Still Need Help?"),
          translateText("Our support team is available 24/7 to assist you with any questions or concerns."),
          translateText("Contact Support"),
          translateText("Help Information"),
          translateText("Information about this topic will be available soon."),
          translateText("For immediate assistance, please contact our support team.")
        ]);
  
        setTranslatedContent({
          helpCenterTitle: translations[0],
          helpSubtitle: translations[1],
          stillNeedHelp: translations[2],
          supportText: translations[3],
          contactSupport: translations[4],
          defaultModalTitle: translations[5],
          defaultModalText: translations[6],
          immediateAssistance: translations[7]
        });
      };
  
      translateStaticContent();
    }, [selectedLanguage, translateText]);

    
  // Translate help categories and build translation map
  useEffect(() => {
    const translateCategories = async () => {
      const translatedCategories = [];
      const newTranslationMap = {};

      for (const category of helpCategories) {
        const translatedTitle = selectedLanguage === "English" 
          ? category.title 
          : await translateText(category.title);

        const translatedLinks = await Promise.all(
          category.links.map(async (link) => {
            const translatedLink = selectedLanguage === "English" 
              ? link 
              : await translateText(link);
            
            newTranslationMap[link] = translatedLink;
            newTranslationMap[translatedLink] = link;
            
            return translatedLink;
          })
        );

        translatedCategories.push({
          ...category,
          translatedTitle,
          translatedLinks
        });
      }

      setTranslatedHelpCategories(translatedCategories);
      setTranslationMap(newTranslationMap);
    };

    translateCategories();
  }, [selectedLanguage, translateText]);


    // Translate modal content
    useEffect(() => {
      const translateModalContent = async () => {
        const translated = {};
        
        for (const [key, value] of Object.entries(modalContentMap)) {
          const translatedTitle = selectedLanguage === "English" 
            ? value.title 
            : await translateText(value.title);
          
          const contentClone = JSON.parse(JSON.stringify(value.content));
          
          translated[key] = {
            title: translatedTitle,
            content: contentClone
          };
        }
        
      };
  
      translateModalContent();
    }, [selectedLanguage, translateText]);

    
    useEffect(() => {
      const handleScrollToTop = () => {
        window.scrollTo(0, 0);
      };
  
      handleScrollToTop();
    }, []);
    

      // Function to translate modal content
  const translateModalContent = async (content) => {
    if (selectedLanguage === "English") return content;
    const translated = JSON.parse(JSON.stringify(content));
    translated.title = await translateText(content.title);
    const translateElement = async (element) => {
      if (typeof element === 'string') {
        return await translateText(element);
      }
      
      if (!element || typeof element !== 'object') return element;
      
      if (Array.isArray(element)) {
        return await Promise.all(element.map(translateElement));
      }
      
      if (element.props && element.props.children) {
        const translatedChildren = await translateElement(element.props.children);
        return {
          ...element,
          props: {
            ...element.props,
            children: translatedChildren
          }
        };
      }
      
      return element;
    };
    
    translated.content = await translateElement(content.content);
    return translated;
  };

  const openModal = async (displayText) => {
    const originalKey = translationMap[displayText] || displayText;
    
    const content = modalContentMap[originalKey] || {
      title: translatedContent.defaultModalTitle,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">{translatedContent.defaultModalText}</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              {translatedContent.immediateAssistance}
            </p>
          </div>
        </div>
      )
    };

    // Translate the entire modal content
    const translatedContent = await translateModalContent(content);
    setTranslatedModalContent(translatedContent);
  };


  const closeModal = () => {
    setTranslatedModalContent(null);
  };

  return (
    <>
      <HeroBanner />
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#5A3ECB] mb-4">{translatedContent.helpCenterTitle}</h1>
            <p className="text-lg text-gray-600">{translatedContent.helpSubtitle}</p>
          </div>


          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {(translatedHelpCategories.length > 0 ? translatedHelpCategories : helpCategories).map((category, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-[#5A3ECB] mb-4 flex items-center gap-2">
          {category.icon} {category.translatedTitle || category.title}
          </h2>
          <ul className="space-y-2">
          {(category.translatedLinks || category.links).map((link, i) => (
              <li key={i}>
                <button
                  onClick={() => openModal(link)}
                  className="text-blue-600 hover:underline"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>


          {/* Contact Section */}
          <div className="bg-[#5A3ECB] text-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">{translatedContent.stillNeedHelp}</h2>
            <p className="mb-4">
            {translatedContent.supportText}
            </p>
            <Link
              to="/contact-us"
              className="inline-block bg-white text-[#5A3ECB] px-6 py-2 rounded-lg font-medium shadow-md hover:bg-gray-100 transition"
            >
               {translatedContent.contactSupport}
            </Link>
          </div>
        </div>

        {/* Modal */}
        {translatedModalContent && (
        <div
          className="fixed inset-0 flex items-center justify-center overflow-y-scroll z-50 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg m-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#5A3ECB]">
                {translatedModalContent.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 p-2"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              {translatedModalContent.content}
            </div>
          </div>
        </div>
      )}
      </div>
      <FooterPrime />
      <AllAbouJumiaFooter />
    </>
  );
}