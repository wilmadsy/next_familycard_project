import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import AddKkButton from "@/components/buttonkk/AddKkButton";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js | Family Card Table",
  description:
    "This is Next.js Basic Table page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Family Card" />

      <div className="space-y-6">
        <ComponentCard title="Data Kartu Keluarga"
        action={<AddKkButton />}>

          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
