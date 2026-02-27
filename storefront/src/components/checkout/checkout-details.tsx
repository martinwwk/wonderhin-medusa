'use client';

import React, {JSX, useCallback, useMemo, useState} from 'react';
import Heading from '@/components/shared/heading';
import ShippingAddress, {ShippingFormData} from '@/components/checkout/shipping-address';
import ContactForm, {ContactFormData} from '@/components/checkout/contact-form';
import PaymentMethod, {PaymentFormData} from '@/components/checkout/payment-method';
import {CircleUserRound, MapPinHouse, CreditCard} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {ROUTES} from '@/utils/routes';

// Define the type for checkout steps
type CheckoutStep = 'contact' | 'shipping' | 'payment';


// Define interface for formData state
interface FormData {
    contact: ContactFormData | null;
    shipping: ShippingFormData | null;
    payment: PaymentFormData | null;
}

// Define interface for step data
interface StepData {
    id: number;
    icon: JSX.Element;
    title: string;
    sub: string;
    component: JSX.Element;
    key: CheckoutStep;
}

const CheckoutDetails: React.FC = () => {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState<CheckoutStep>('contact');
    const [formData, setFormData] = useState<FormData>({
        contact: null,
        shipping: null,
        payment: null,
    });

    // Handle completion of each step
    const handleContactComplete = useCallback((data: ContactFormData) => {
        setFormData(prev => ({...prev, contact: data}));
        setActiveStep('shipping');
    }, []);

    const handleShippingComplete = useCallback((data: ShippingFormData) => {
        setFormData(prev => ({...prev, shipping: data}));
        setActiveStep('payment');
    }, []);

    const handlePaymentComplete = useCallback((data: PaymentFormData) => {
        setFormData(prev => {
            const updated = {...prev, payment: data};
            console.log('Order completed!', updated);
            return updated;
        });
        router.push(ROUTES.ORDER);
    }, [router]);

    // Define the data for each step
    const steps = useMemo<StepData[]>(() => [
        {
            id: 1,
            icon: <CircleUserRound strokeWidth={1} size={30}/>,
            title: 'Contact information',
            sub: formData.contact
                ? `${formData.contact.firstName} ${formData.contact.lastName} ${formData.contact.phone}`
                : 'Luhan Nguyen +855 - 445 - 6644',
            component: <ContactForm onComplete={handleContactComplete}/>,
            key: 'contact',
        },
        {
            id: 2,
            icon: <MapPinHouse strokeWidth={1} size={30}/>,
            title: 'Shipping Address',
            sub: formData.shipping
                ? `${formData.shipping.address}, ${formData.shipping.city}, ${formData.shipping.country}`
                : 'Sunset Blvd, Los Angeles, CA 90046, USA',
            component: <ShippingAddress onComplete={handleShippingComplete}/>,
            key: 'shipping',
        },
        {
            id: 3,
            icon: <CreditCard strokeWidth={1} size={30}/>,
            title: 'Payment Method',
            sub: formData.payment
                ? `${formData.payment.cardType} xxx-xxx-xx${formData.payment.cardNumber.slice(-4)}`
                : 'Mastercard / Visa xxx-xxx-xx45',
            component: <PaymentMethod onComplete={handlePaymentComplete}/>,
            key: 'payment',
        },
    ], [formData, handleContactComplete, handleShippingComplete, handlePaymentComplete]);

    return (
        <div className="overflow-hidden space-y-6">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className="accordion__panel expanded overflow-hidden rounded-md border border-border-base"
                >
                    <div className="bg-white flex items-center p-4 cursor-pointer sm:pt-5 sm:px-6 pb-7">
                        <span className="flex justify-center h-9 w-9 text-brand-dark ltr:mr-5 rtl:ml-5">
                          {step.icon}
                        </span>
                        <div>
                            <Heading variant="checkoutHeading">{step.title}</Heading>
                            <div className="font-medium text-sm text-brand-dark">{step.sub}</div>
                        </div>
                        {formData[step.key] && (
                            <button
                                onClick={() => setActiveStep(step.key)}
                                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-200 mt-5 sm:mt-0 sm:ms-auto text-sm rounded-lg"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {activeStep === step.key && (
                        <div
                            className="pb-6 ltr:pl-5 rtl:pr-5 sm:ltr:pl-5 sm:rtl:pr-5 lg:ltr:pl-7 lg:rtl:pr-7 ltr:pr-7 rtl:pl-5 bg-white">
                            <div className="border-t border-border-two pt-7">{step.component}</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CheckoutDetails;