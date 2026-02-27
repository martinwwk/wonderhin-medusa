import { ROUTES } from '@/utils/routes';
import Image from '@/components/shared/image';
import cn from "classnames";
import { usePanel } from "@/hooks/use-panel";
import Link from "@/components/shared/link";

const ErrorInformation: React.FC = () => {
  return (
    <div className="flex items-center justify-center  pt-20 text-center ">
      <div className="max-w-md xl:max-w-2xl text-center">
        <Image src="/assets/images/404.png" alt="signin" width={500} height={300} />
        <div className="text-2xl md:text-4xl  font-semibold text-brand-dark">Oops...That link is broken.</div>
        <p className="text-15px md:text-base leading-6  pt-5 pb-10">
          Sorry for the inconvenience. Go to our homepage or check out our latest collections.

        </p>
        <Link
            href={ROUTES.HOME}
            variant={"button-black"}
            className={cn("m-auto md:max-w-[230px] "
            )}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ErrorInformation;
