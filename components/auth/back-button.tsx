"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type BackButtonType = {
  href: string;
  label: string;
};

export default function BackButton({ href, label }: BackButtonType) {
  return (
    <Button className="font-medium w-full">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
