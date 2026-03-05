import Container from '@/components/shared/container';
import AccountNav from '@/components/account/account-nav';
import {ROUTES} from '@/utils/routes';

import AccountNavMobile from '@/components/account/account-nav-mobile';

const accountMenu = [
    {
        slug: ROUTES.ACCOUNT,
        name: 'accountInfo',
    },
    {
        slug: ROUTES.ORDERS,
        name: 'myOrder',
    },
    {
        slug: ROUTES.SAVELISTS ,
        name: 'saveLists',
    },
    {
        slug: ROUTES.ACCOUNT_BILLING,
        name: 'changeBilling',
    },
    
    {
        slug: ROUTES.CHANGE_PASSWORD,
        name: 'changePassword',
    },
];

export default async function AccountLayout({
                                                children,
    }: {
    children: React.ReactNode;
}) {
    return (
            <Container>
                <div className="pt-10 2xl:pt-12 pb-12 lg:pb-14 xl:pb-16 2xl:pb-20 mx-auto">
                    <div className="flex flex-col w-full ">
                        <div className="lg:hidden">
                            <AccountNavMobile options={accountMenu}/>
                        </div>
                        <div className="hidden lg:block shrink-0 ">
                            <AccountNav options={accountMenu}/>
                        </div>
                        
                        <div
                            className="w-full  mt-4 md:mt-8 ">
                            {children}
                        </div>
                    </div>
                </div>
            </Container>
    );
}
