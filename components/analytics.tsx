"use client";

import dynamic from "next/dynamic";

const OpenPanelComponent = dynamic(
  () => import("@openpanel/nextjs").then((m) => m.OpenPanelComponent),
  { ssr: false }
);

export function Analytics() {
  return (
    <OpenPanelComponent
      clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
      apiUrl="/api/op"
      scriptUrl="/api/op/op1.js"
      trackScreenViews={true}
      trackOutgoingLinks={false}
      trackAttributes={false}
    />
  );
}
