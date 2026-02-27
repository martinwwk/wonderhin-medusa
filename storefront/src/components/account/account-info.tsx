"use client";
import Input from '@/components/shared/form/input';
import Button from '@/components/shared/button';
import Heading from '@/components/shared/heading';
import {useForm} from 'react-hook-form';
import {UpdateUserType, useUpdateUserMutation,} from '@/lib/data/template-customer';
import { FaCamera } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import TextArea from "@/components/shared/form/text-area";
import React, {useState} from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';

import cn from "classnames";
import Divider from "@/components/shared/divider";
import Image from "@/components/shared/image";
import { useI18n } from "@lib/hooks/use-i18n";


const defaultValues = {};

const AccountInfo: React.FC = () => {
    const {mutate: updateUser} = useUpdateUserMutation();
    const { t } = useI18n();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateUserType>({
        defaultValues,
    });
    
    function onSubmit(input: UpdateUserType) {
        updateUser(input);

        // reset form after submit
       // reset();
    }
    
    const people = [
        { id: 1, name: t('male') },
        { id: 2, name: t('female') },
        { id: 3, name: t('other') },
    ]
    const [selected, setSelected] = useState(people[1])
    
    return (
        <div className="flex flex-col w-full">
            
            <div className="dashboard__main-top">
                <div className="flex flex-col sm:flex-row flex-wrap">
                    <div className="w-full sm:w-1/2">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className={"w-20 h-20"}>
                                    <Image
                                        src={"/assets/images/support/3.png"}
                                        alt={"avatar"}
                                        width={90}
                                        height={90}
                                        className=" rounded-full"
                                    />
                                </div>
                                
                                <input id="profile-thumb-input" className="hidden" type="file"/>
                                <label
                                    htmlFor="profile-thumb-input"
                                    className="flex items-center justify-center border-2 rounded-full text-white w-8 h-8 absolute bottom-2 border-white -right-2 bg-gray-500 text-center cursor-pointer">
                                    <FaCamera/>
                                </label>
                            </div>
                            
                            <div className="dashboard__main-content">
                                <h4 className="text-brand-dark text-xl font-semibold mb-1">{t('welcomeUser', { name: 'Luhan Nguyen' })}</h4>
                                <p className="text-base  mb-0">yourexample@email.com · Los Angeles, CA</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2"></div>
                </div>
            </div>
            <Divider />
            <Heading variant="titleMedium" className="mb-5 md:mb-6 lg:mb-7 ">
                {t('accountInformation')}
            </Heading>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center w-full mx-auto"
                noValidate
            >
                <div className="pb-7 md:pb-8 lg:pb-10">
                    <div className="flex flex-col space-y-4 sm:space-y-5">
                        <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                            <Input
                                id={"account-username"}
                                label={t('userName')}
                                {...register('userName', {
                                    required: 'User name is required',
                                })}
                                variant="solid"
                                defaultValue="Luhan Nguyen"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.userName?.message}
                            />
                            <Input
                                id={"account-email"}
                                type="email"
                                label={t('email')}
                                {...register('email', {
                                    required: 'You must need to provide your email address',
                                    pattern: {
                                        value:
                                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please provide valid email address',
                                    },
                                })}
                                variant="solid"
                                defaultValue="yourexample@email.com"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.email?.message}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                            <Input
                                id={"account-addess"}
                                label={t('address')}
                                {...register('addess', {
                                    required: 'Addess name is required',
                                })}
                                variant="solid"
                                defaultValue="Los Angeles, USA"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.addess?.message}
                            />
                            <Input
                                label={t('dateOfBirth')}
                                {...register('date', {
                                    required: 'Date of birth is required',
                                })}
                                variant="solid"
                                type="date"
                                defaultValue="1996-06-22"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.date?.message}
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                            <div className="w-full sm:w-1/2 px-1.5 md:px-2.5">
                                <label
                                    htmlFor={"gender"}
                                    className={`block text-brand-dark font-medium text-sm leading-none mb-3 cursor-pointer`}
                                >
                                    {t('gender')}
                                </label>
                                <Listbox value={selected} onChange={setSelected}>
                                    <ListboxButton
                                        className={cn(
                                            'py-2 px-4 w-full text-start appearance-none relative transition  border bg-white  text-13px lg:text-sm font-body rounded-full  min-h-11  duration-200 ease-in-out ',
                                            'focus:ring-0 text-brand-dark border-border-two focus:border-1 focus:outline-none focus:border-gray-400 h-11'
                                        )}
                                    >
                                        {selected.name}
                                        <FaCaretDown
                                            className="group pointer-events-none absolute top-2.5 end-2.5 size-4 fill-black/60 text-black"
                                            aria-hidden="true"
                                        />
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor="bottom"
                                        transition
                                        className={cn(
                                            'w-[var(--button-width)] rounded border border-black/15 bg-white p-1 drop-shadow-md focus:outline-none',
                                            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                                        )}
                                    >
                                        {people.map((person) => (
                                            <ListboxOption
                                                key={person.name}
                                                value={person}
                                                className="group flex cursor-pointer items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                            >
                                                <div className="text-sm text-black">{person.name}</div>
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                            
                            
                            <Input
                                type="tel"
                                label={t('phoneNumber')}
                                {...register('phoneNumber', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // allows international formats
                                        message: 'Please enter a valid phone number',
                                    },
                                    minLength: {
                                        value: 7,
                                        message: 'Phone number must be at least 7 digits',
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: 'Phone number must be no more than 15 digits',
                                    },
                                })}
                                variant="solid"
                                defaultValue="003 800 6890"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.phoneNumber?.message}
                            />
                        </div>
                        
                        <TextArea
                            variant="solid"
                            label={t('message')}
                            defaultValue="..."
                            {...register('message')}
                            placeholder="Message.."
                        />
                    </div>
                </div>
                
                
                <div className="relative flex pb-2 mt-5 sm:ltr:ml-auto sm:rtl:mr-auto lg:pb-0">
                    <Button
                        type="submit"
                        variant="formButton"
                        className="w-full sm:w-auto"
                    >
                        {t('updateAccount')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AccountInfo;
