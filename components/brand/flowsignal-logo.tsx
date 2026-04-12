import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type FlowSignalLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  lockup?: boolean;
};

export function FlowSignalLogo({
  href = '/',
  className,
  imageClassName,
  lockup = false
}: FlowSignalLogoProps) {
  const logo = lockup ? (
    <Image
      src="/brand/flowsignal-logo.png"
      alt="FlowSignal Financial Intelligence"
      width={310}
      height={245}
      priority
      className={cn('h-auto w-44', imageClassName)}
    />
  ) : (
    <span className="flex items-center gap-3">
      <Image
        src="/brand/flowsignal-mark.png"
        alt=""
        width={48}
        height={38}
        priority
        className={cn('h-9 w-auto', imageClassName)}
      />
      <span className="text-lg font-semibold text-gray-950">FlowSignal</span>
    </span>
  );

  return (
    <Link href={href} className={cn('inline-flex items-center', className)}>
      {logo}
    </Link>
  );
}
