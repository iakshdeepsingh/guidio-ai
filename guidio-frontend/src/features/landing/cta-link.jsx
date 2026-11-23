import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@clerk/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const baseClasses =
  "group touch-manipulation rounded-full font-medium tracking-[-0.01em] outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

const sizeClasses = {
  md: "h-9 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-7 text-[1.0625rem]",
};

/**
 * A link that looks like a button. Pass `to` for an in-app route or `href`
 * for an in-page anchor. It is a real <a>, never a button wrapping a link.
 */
export function CtaLink({
  to,
  href,
  variant = "default",
  size = "lg",
  className,
  children,
  ...props
}) {
  const classes = cn(
    buttonVariants({ variant }),
    baseClasses,
    sizeClasses[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}

/**
 * Main call to action. Sends signed-in students to the dashboard and
 * everyone else to sign-up.
 */
export const PrimaryCta = memo(function PrimaryCta({
  size = "lg",
  variant = "default",
  className,
  label = "Get Started for Free",
  ...props
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = isLoaded && isSignedIn;

  return (
    <CtaLink
      to={signedIn ? "/dashboard" : "/sign-up"}
      size={size}
      variant={variant}
      className={className}
      {...props}
    >
      {signedIn ? "Go to dashboard" : label}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </CtaLink>
  );
});