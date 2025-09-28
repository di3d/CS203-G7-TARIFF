"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

async function addTariff() {
  const newTariff = { name: "Electronics chips thingy", price: 15.5 };
  const response = await axios.post("http://localhost:8080/api/tariffs", newTariff);
  console.log("Saved tariff:", response.data);
}

export default function AdminPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Admin Page</h1>
            <p className="mt-2">Edit Tariff</p>
            <button
                onClick={addTariff}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"></button>
        </div>
    );
}
