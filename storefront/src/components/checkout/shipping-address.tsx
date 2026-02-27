import {useForm, Controller} from 'react-hook-form';
import Input from '@/components/shared/form/input';
import React, {useCallback, useState} from "react";
import Button from "@/components/shared/button";
import {RadioGroup, RadioGroupItem} from "@/components/shared/radio-group";
import { useI18n } from "@lib/hooks/use-i18n";

export interface ShippingFormData {
	firstName: string
	lastName: string
	address: string
	aptSuite: string
	city: string
	country: string
	stateProvince: string
	postalCode: string
	addressType: "home" | "office"
}

interface ShippingAddressProps {
	onComplete: (data: ShippingFormData) => void
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({onComplete}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useI18n();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ShippingFormData>({
		defaultValues: {
			firstName: "Luhan",
			lastName: "Nguyen",
			address: "529 Sunset Blvd, Los Angeles",
			aptSuite: "55U - DD5",
			city: "Norris",
			country: "United States",
			stateProvince: "Los Angeles",
			postalCode: "90017",
			addressType: "home",
		},
	})
	
	const [addressType, setAddressType] = useState("home");
	const handleOpen = useCallback(() => {
		setIsOpen(!isOpen)
	}, [isOpen]);
	return (
		<div className="w-full">
			<form onSubmit={handleSubmit(onComplete)} noValidate>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* First name and Last name */}
					<Input
						label={t('firstName')}
						{...register("firstName", {
							required: t('firstNameRequired'),
						})}
						error={errors.firstName?.message}
					/>
					
					<Input
						label={t('lastName')}
						{...register("lastName", {
							required: t('lastNameRequired'),
						})}
						error={errors.lastName?.message}
					/>
					
					{/* Address and Apt, Suite */}
					<Input
						label={t('address')}
						{...register("address", {
							required: t('addressRequired'),
						})}
						error={errors.address?.message}
					/>
					
					<Input
						label={t('aptSuite')}
						{...register("aptSuite", {
							required: t('aptSuiteRequired'),
						})}
						error={errors.aptSuite?.message}
						className="w-full "
					/>
					
					{/* City and Country */}
					<Input
						label={t('city')}
						{...register("city", {
							required: t('cityRequired'),
						})}
						error={errors.city?.message}
						className="w-full "
					/>
					
					<div className="space-y-2">
						<label htmlFor="country"
						       className={`block text-brand-dark font-medium text-sm leading-none mb-3 cursor-pointer`}>{t('country')}</label>
						<div className="relative">
							<Controller
								name="country"
								control={control}
								render={({field}) => (
									<div className="relative">
										<select
											{...field}
											className="w-full h-12 px-3 bg-transparent rounded-full border  border-gray-200 text-13px  appearance-none focus:outline-none focus:ring-3 focus:ring-black/5"
											onClick={handleOpen}
										>
											<option value="United States">United States</option>
											<option value="Canada">Canada</option>
											<option value="United Kingdom">United Kingdom</option>
											<option value="Australia">Australia</option>
											<option value="Germany">Germany</option>
										</select>
										
									</div>
								)}
							/>
						</div>
					</div>
					
					{/* State/Province and Postal code */}
					<Input
						label={t('stateProvince')}
						{...register("stateProvince", {
							required: t('stateProvinceRequired'),
						})}
						error={errors.stateProvince?.message}
						className="w-full "
					/>
					<Input
						label={t('postalCode')}
						{...register('postalCode', {
							required: t('postalCodeRequired'),
							pattern: {
								value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // allows international formats
								message: t('validPostalCode'),
							}
						})}
						error={errors.postalCode?.message}
						className="w-full "
					/>
				
				
				</div>
				
				{/* Address type */}
				<div className="mt-6">
					<label htmlFor="country"
					       className={`block text-brand-dark font-medium text-sm leading-none mb-3 cursor-pointer`}>{t('country')}</label>
					<div className="mt-2  ">
						<RadioGroup value={addressType} onValueChange={setAddressType} className={"grid-cols-1 sm:grid-cols-2 sm:gap-6"}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value={'home'} id="r1"/>
								<label htmlFor="r1" className="text-sm font-medium text-brand-dark">
									{t('homeDelivery')} <span className="font-light">({t('allDayDelivery')})</span>
								</label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value='office' id="r2"/>
								<label htmlFor="r2" className="text-sm font-medium text-brand-dark">
									{t('office')} <span className="font-light">({t('officeDeliveryHours')})</span>
								</label>
							</div>
						</RadioGroup>
					</div>
				</div>
				
				<div className="ltr:text-right rtl:text-left mt-10">
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

export default ShippingAddress;
