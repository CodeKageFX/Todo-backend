import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.todo.createMany({
        data: [
            { title: "Buy groceries", description: "Milk, eggs, bread", status: "pending", priority: "high", dueDate: "2024-12-31" },
            { title: "Read a book", description: "Finish Atomic Habits", status: "pending", priority: "low", dueDate: "2024-12-20" },
            { title: "Exercise", description: "30 minutes cardio", status: "completed", priority: "high", dueDate: "2024-12-15" },
            { title: "Fix login bug", description: "Users can't reset password", status: "pending", priority: "high", dueDate: "2024-12-10" },
            { title: "Write tests", description: "Unit tests for auth module", status: "pending", priority: "medium", dueDate: "2024-12-25" },
            { title: "Call mum", description: "Check in on the family", status: "completed", priority: "high", dueDate: "2024-12-05" },
            { title: "Clean the house", description: "Vacuum and mop floors", status: "pending", priority: "low", dueDate: "2024-12-22" },
            { title: "Update resume", description: "Add recent projects", status: "pending", priority: "medium", dueDate: "2024-12-18" },
            { title: "Pay electricity bill", description: "Due by end of month", status: "completed", priority: "high", dueDate: "2024-12-31" },
            { title: "Learn Docker", description: "Watch intro tutorial", status: "pending", priority: "medium", dueDate: "2024-12-28" },
            { title: "Design new landing page", description: "Figma mockup first", status: "pending", priority: "medium", dueDate: "2024-12-20" },
            { title: "Refactor user service", description: "Too many responsibilities", status: "pending", priority: "low", dueDate: "2025-01-15" },
            { title: "Buy new headphones", description: "Research best options", status: "pending", priority: "low", dueDate: "2024-12-30" },
            { title: "Set up CI/CD pipeline", description: "GitHub Actions for deployment", status: "pending", priority: "high", dueDate: "2024-12-12" },
            { title: "Write blog post", description: "Topic: REST API best practices", status: "pending", priority: "low", dueDate: "2025-01-10" },
            { title: "Drink more water", description: "At least 2 litres a day", status: "completed", priority: "medium", dueDate: "2024-12-08" },
            { title: "Review pull requests", description: "3 PRs waiting on review", status: "pending", priority: "high", dueDate: "2024-12-09" },
            { title: "Backup laptop", description: "External drive or cloud", status: "pending", priority: "medium", dueDate: "2024-12-24" },
            { title: "Plan weekend trip", description: "Look up places nearby", status: "pending", priority: "low", dueDate: "2024-12-21" },
            { title: "Fix navbar responsiveness", description: "Breaks on mobile screens", status: "completed", priority: "high", dueDate: "2024-12-02" },
        ]
    });

    console.log("✅ Seeded 20 todos successfully");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());