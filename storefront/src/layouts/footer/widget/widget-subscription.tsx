'use client';

import {useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import Input from '@/components/shared/form/input';
import EmailIcon from '@/components/icons/email-icon';
import Text from '@/components/shared/text';
import Heading from '@/components/shared/heading';
import cn from 'classnames';
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";
import Button from "@/components/shared/button";
import { useI18n } from '@/lib/hooks/use-i18n';

interface NewsLetterFormValues {
    email: string;
}

const defaultValues = {
    email: '',
};

function SubscriptionForm({variant}: { variant?: string; }) {
    const { t } = useI18n();
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<NewsLetterFormValues>({
        defaultValues,
    });

    const [subscriptionSuccess, setSubscriptionSuccess] = useState<boolean>(false);
    
    function onSubmit() {
        // show success message
        setSubscriptionSuccess(true);
        
        // remove success message after 3 seconds
        setTimeout(() => {
            setSubscriptionSuccess(false);
        }, 5000);
        
        // reset form after submit
        reset();
    }

    const btnVariant= useMemo(() => {
        switch (variant) {
            case 'dark':
                return "primary";
            default:
                return "formButton";
        }
    }, [variant]);

    return (
        <>
            <form
                noValidate
                className="flex relative gap-3 md:gap-5"
                onSubmit={handleSubmit(onSubmit)}
            >
              <span className="flex items-center absolute ltr:left-0 rtl:right-0 top-0 h-12 px-3.5 transform">
                <EmailIcon className="w-4 2xl:w-[18px] h-4 2xl:h-[18px]"/>
              </span>
                <Input
                    placeholder={t('enterYourEmailPlaceholder')}
                    type="email"
                    id="subscription-email"
                    variant="solid"
                    className="w-full"
                    inputClassName={cn('ps-10 md:ps-10 pe-10 md:pe-10 2xl:px-11 h-12 rounded-full ',
                        {
                            'xs:border-white/10': variant === 'dark',
                        }
                    )}
                    {...register('email', {
                        required: t('emailProvideRequired'),
                        pattern: {
                            value:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: t('emailProvideValid'),
                        },
                    })}
                    error={errors.email?.message}
                />

                <Button
                    className={`basis-1/2 `}
                    variant={btnVariant}
                >
                    {t('signUp')}
                </Button>
            
            </form>
            {!errors.email && subscriptionSuccess && (
                <p className="my-3 text-sm text-brand">
                    {t('thanksForSubscribing')}
                </p>
            )}
        </>
    );
}

interface Props {
    className?: string;
    variant?: string;
}


const WidgetSubscription: React.FC<Props> = ({className, variant}) => {
    const { t } = useI18n();

    return (
        <div className={cn(className)}>
            <Heading variant="title" className={cn(' mb-4 lg:mb-5',{
                    'text-white': variant === 'dark',
                })}
            >
                {t('signUpForNewsletter')}
            </Heading>
            
            <Text variant={'body'} className={cn("pb-6 mb-0")}>
                {t('newsletterDescription')}
            </Text>
            <SubscriptionForm variant={variant}/>
            <Text variant={'body'} className="mt-5">
                {t('acceptTerms')}
                <Link href={ROUTES.TERMS} variant={"reversed"} className={cn("font-semibold text-brand-dark ps-1 pe-1", {
                        'text-white': variant === 'dark',
                    })} >
                    {t('termsAndConditions')}
                </Link>
                {t('theAnd')}
                <Link href={ROUTES.PRIVACY} variant={"reversed"} className={cn("font-semibold text-brand-dark ps-1", {
                    'text-white': variant === 'dark',
                })} >
                    {t('privacyPolicy')}
                </Link>
                
            </Text>
        </div>
    );
};

export default WidgetSubscription;
