'use client';

import PasswordInput from '@/components/shared/form/password-input';
import Button from '@/components/shared/button';
import Heading from '@/components/shared/heading';
import { useForm } from 'react-hook-form';
import {
  useChangePasswordMutation,
  ChangePasswordInputType,
} from '@/lib/data/template-customer';
import { useI18n } from "@lib/hooks/use-i18n";

const defaultValues = {
  oldPassword: '',
  newPassword: '',
};

const ChangePassword: React.FC = () => {
  const { mutate: changePassword } = useChangePasswordMutation();
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputType>({
    defaultValues,
  });
  function onSubmit(input: ChangePasswordInputType) {
    changePassword(input);
  }
  return (
    <>
      <Heading variant="titleMedium">
        {t('updateYourPassword')}
      </Heading>
      <div className="flex flex-col w-full mt-6 lg:w-10/12 2xl:w-9/12 lg:mt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center max-w-xl "
        >
          <div className="flex flex-col space-y-5 lg:space-y-7">
            <PasswordInput
              label={t('currentPassword')}
              error={errors.oldPassword?.message}
              {...register('oldPassword', {
                required: `You must need to provide your old password`,
              })}
            />
            <PasswordInput
              label={t('newPassword')}
              error={errors.newPassword?.message}
              {...register('newPassword', {
                required: `You must need to provide your new password`,
              })}
            />

            <div className="relative mt-3">
              <Button
                type="submit"
                variant="formButton"
                className="w-full sm:w-auto"
              >
                {t('updatePassword')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
