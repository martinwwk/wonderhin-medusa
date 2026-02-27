import {useForm} from 'react-hook-form';

import Input from "@/components/shared/form/input";
import React, {useState} from "react";
import Switch from "@/components/shared/switch";
import Button from "@/components/shared/button";
import Link from "@/components/shared/link";
import { useI18n } from "@lib/hooks/use-i18n";

export type ContactFormData = {
	phone: string
	email: string
	firstName: string
	lastName: string
	receiveNews: boolean
}

interface ContactFormProps {
	onComplete: (data: ContactFormData) => void
}

const ContactForm: React.FC <ContactFormProps> = ({ onComplete }) => {
	const { t } = useI18n();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactFormData>({
		defaultValues: {
			phone: "+8553456644",
			email: "yourexample@email.com",
			firstName:"Luhan",
			lastName:"Nguyen",
			receiveNews: false,
		},
	})
	
	const [receiveNews, setReceiveNews] = useState(true);
	
	
	return (
		<div className="w-full ">
			<form onSubmit={handleSubmit(onComplete)}>
				<div className="md:flex justify-between items-center mb-6">
					<h1 className="text-base text-brand-dark font-semibold">{t('contactInformation')}</h1>
					<div className="text-sm">
						{t('doNotHaveAccount')}{" "}
						<Link href="/login" className="hover:underline">
							{t('logIn')}
						</Link>
					</div>
				</div>
				<div className="space-y-6">
					<Input
						id={"checkout-phone-number"}
						type="tel"
						label={t('yourPhoneNumber')}
						{...register('phone', {
							required: t('phoneRequired'),
							pattern: {
								value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // allows international formats
								message: t('validPhone'),
							},
							minLength: {
								value: 7,
								message: t('phoneMinLength'),
							},
							maxLength: {
								value: 15,
								message: t('phoneMaxLength'),
							},
						})}
						className="w-full"
						error={errors.phone?.message}
					/>
					
					<Input
						id={"checkout-email"}
						type="email"
						label={t('emailAddress')}
						{...register('email', {
							required: t('emailRequired'),
							pattern: {
								value:
									/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: t('validEmail'),
							},
						})}
						error={errors.email?.message}
					/>
					
					<div className="flex items-center space-x-2">
						<label className="relative inline-block cursor-pointer switch">
							<Switch {...register('receiveNews')} checked={receiveNews} onChange={setReceiveNews}/>
						</label>
						<label
							onClick={() => setReceiveNews(!receiveNews)}
							className="mt-1 text-sm cursor-pointer shrink-0 text-heading ltr:pl-2.5 rtl:pr-2.5"
						>
							{t('emailMeNewsAndOffers')}
						</label>
					
					</div>
				</div>
				
				<div className="ltr:text-right rtl:text-left mt-6">
					<Button
						type="submit"
						variant="formButton"
						className="xs:text-sm  text-brand-light min-w-48"
					>
						{t('saveAndNextSteps')}
					</Button>
				</div>
				
			</form>
		</div>
);
};

export default ContactForm;
