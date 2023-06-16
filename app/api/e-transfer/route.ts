import { NextResponse } from "next/server";
import { User, Wallet } from "../../types";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const accounts: Wallet[] = [
        {
            id: "1",
            name: "Euros",
            currency: "EUR",
            balance: 115741,
            logo: "",
        },
        {
            id: "2",
            name: "US dollar",
            currency: "USD",
            balance: 1005,
            logo: "",
        },
        {
            id: "3",
            name: "South African Rand",
            currency: "ZAR",
            balance: 39134,
            logo: "",
        },
    ];

    const user = {
        name: "Mark Woods",
            email: "mark.wood@gmail.com",
            phone: "+27 80 000 0000",
            address: "22 Bree Street, Cape Town, Western Cape, South Africa",
            birthdate: "1966-08-22",
            fiId: "004-12345",
            accountNo: "123456789012",
            bankName: "ABSA Bank"
    }

    const recentPayees: User[] = [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@gmail.com",
            phone: "+27 81 111 1111",
            address: "15 Main Street, Johannesburg, Gauteng, South Africa",
            birthdate: "1978-05-10",
            fiId: "004-67890",
            accountNo: "987654321098",
            bankName: "Standard Bank"
          },
          {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@gmail.com",
            phone: "+27 82 222 2222",
            address: "10 High Road, Durban, KwaZulu-Natal, South Africa",
            birthdate: "1990-11-15",
            fiId: "004-54321",
            accountNo: "456789012345",
            bankName: "First National Bank"
          },
          {
            id: "1",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@gmail.com",
            phone: "+27 83 333 3333",
            address: "5 Elm Avenue, Pretoria, Gauteng, South Africa",
            birthdate: "1985-07-03",
            fiId: "004-98765",
            accountNo: "654321098765",
            bankName: "Nedbank"
          }
    ];

    const purposes: string[] = [
        "Software development services",
        "Infrastructure maintenance and support",
        "Cloud hosting and storage",
        "Software licensing and subscriptions",
        "IT consulting and advisory"
    ];

    const data = {
        accounts,
        recentPayees,
        purposes
    }

    return NextResponse.json({ ...data });

}
