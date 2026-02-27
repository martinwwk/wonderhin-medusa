'use client';
import {FC, useEffect} from 'react';
import Heading from '@/components/shared/heading';
import {usePanel} from "@/hooks/use-panel";

const data = [
    {
        id: 1,
        name: '',
        description: 'Have a question? Please contact us using the customer support channels below.',
    },
    {
        id: 2,
        name: 'Phone',
        description: '+222-1800-2628 </br> +888-1800-2628'
    },
    {
        id: 3,
        name: 'Email',
        description: 'contact@ibigecommerce.com',
    },
    {
        id: 4,
        name: 'Open Time',
        description: 'Our store has re-opened for shopping,</br> exchange Every day 11am to 7pm',
    },
];

interface Props {
    image?: HTMLImageElement;
}

const ContactSupport: FC<Props> = () => {
    const { setSelectedColor } = usePanel();

    useEffect(() => {
        setSelectedColor("sky");
    }, [setSelectedColor]);
    
    return (
        <div className="mb-0 3xl:ltr:pr-5 3xl:rtl:pl-5">
            <Heading variant="heading" className="mb-4">
                Suport Customer
            </Heading>
            
            <div className="mx-auto space-y-3 lg:space-y-5">
                
                {data.map((item) => (
                    <div
                        key={`contact--key${item.id}`}
                        className="flex flex-col "
                    >
                        <div className="text-15px mt-4 lg:mt-0">
                            {item.name && (
                                <Heading variant="base" className="text-15px  mb-2">
                                    {item.name}
                                </Heading>
                            )}
                            
                            <div className={'leading-7'}
                                 dangerouslySetInnerHTML={{__html: item.description}}/>
                        </div>
                    
                    </div>
                ))}
                
                
            
            </div>
        
        </div>
    );
};

export default ContactSupport;
