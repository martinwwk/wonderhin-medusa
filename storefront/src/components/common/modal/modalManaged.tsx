'use client';

import Modal from '@/components/common/modal/modal';
import dynamic from 'next/dynamic';
import { useModal } from '@/hooks/use-modal';

const LoginForm = dynamic(() => import('@/components/auth/login-form'), {ssr: false});
const SignUpForm = dynamic(() => import('@/components/auth/register-form'), {ssr: false});
const ForgetPasswordForm = dynamic(() => import('@/components/auth/forget-password-form'), {ssr: false});
const ProductQuickview = dynamic(() => import('@/components/product/product-quickview'), {ssr: false});
// const InstagramPopup = dynamic(() => import('@/components/instagram/instagram-popup'), {ssr: false});

export default function ModalManaged() {
  const { isOpen, view, closeModal } = useModal();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'LOGIN_VIEW' && <LoginForm/>}
      {view === 'SIGNUP_VIEW' && <SignUpForm />}
      {view === 'FORGET_PASSWORD' && <ForgetPasswordForm />}
      {view === 'PRODUCT_VIEW' && <ProductQuickview/>}
      {/* {view === 'INSTAGRAM_VIEW' && <InstagramPopup/>} */}
    </Modal>
  );
}
