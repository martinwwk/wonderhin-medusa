'use client';

import Input from '@/components/shared/form/input';
import Button from '@/components/shared/button';
import TextArea from '@/components/shared/form/text-area';
import {useForm} from 'react-hook-form';
import Heading from "@/components/shared/heading";
import Text from "@/components/shared/text";
import { useState } from 'react';

interface ContactFormValues {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const ContactForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ContactFormValues>();
    const [contactSuccess, setContactSuccess] = useState<boolean>(false);

    function onSubmit(values: ContactFormValues) {
        console.log(values, 'Contact');
        // show success message
        setContactSuccess(true);
        
        // remove success message after 3 seconds
        setTimeout(() => {
            setContactSuccess(false);
        }, 5000);
        // reset form after submit
        reset();
    }
    
    
    return (
        <>
            <Heading variant="heading" className="mb-4">
                Contact Us
            </Heading>
            <Text className="xl:leading-6 mb-5 lg:mb-6">
                Please submit all general enquiries in the contact form below and we look forward to hearing from you
                soon.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-5"}>
                    <Input
                        placeholder="Your Name"
                        {...register('name', {required: 'You must need to provide your full name'})}
                        error={errors.name?.message}
                    />
                    
                    <Input
                        type="email"
                        placeholder="Your Email"
                        {...register('email', {
                            required: 'You must need to provide your email address',
                            pattern: {
                                value:
                                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Please provide valid email address',
                            },
                        })}
                        error={errors.email?.message}
                    />
                </div>
                
                
                <TextArea
                    {...register('message')}
                    placeholder="Enter please your message.."
                />
                <Button variant="formButton" className="w-full" type="submit">
                    Send Message
                </Button>
            </form>
            {!errors.email && contactSuccess && (
                <p className="my-3 text-sm text-brand">
                    Your message has been sent successfully!
                </p>
            )}
           
        </>
    );
};

export default ContactForm;
