import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Expense = {
    id: number;
    date: string;
    cost: string;
    description: string;
    expense_type: string;
};

export default function Expenses() {
    const [date, setDate] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [expenseType, setExpenseType] = useState('');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [statusMessage, setStatusMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

async function loadExpenses() {
    const response = await fetch('/api/expenses');
    const data = await response.json();

    setExpenses(data);
}

useEffect(() => {
    let cancelled = false;

    fetch('/api/expenses')
        .then((response) => response.json())
        .then((data) => {
            if (!cancelled) {
                setExpenses(data);
            }
        });

    return () => {
        cancelled = true;
    };
}, []);

const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.expense_type.toLowerCase().includes(searchTerm.toLowerCase())
);

function handleEdit(expense: Expense) {
    setEditingId(expense.id);
    setDate(expense.date.substring(0, 10));
    setCost(expense.cost);
    setDescription(expense.description);
    setExpenseType(expense.expense_type);
}

async function handleDelete(id: number) {
    const confirmed = confirm('Are you sure you want to delete this expense?');

    if (!confirmed) {
        return;
    }

    const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
        },
    });

    if (response.ok) {
        alert('Expense deleted successfully!');
        setStatusMessage('Expense deleted successfully!');
        await loadExpenses();
    } else {
        alert('Failed to delete expense.');
    }
}

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = editingId
        ? `/api/expenses/${editingId}`
        : '/api/expenses';

    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            date: date,
            cost: cost === '' ? null : Number(cost),
            description: description,
            expense_type: expenseType,
        }),
    });

    if (response.ok) {
        alert(
            editingId
                ? 'Expense updated successfully!'
                : 'Expense added successfully!'
        );

    setStatusMessage(
        editingId
            ? 'Expense updated successfully!'
            : 'Expense added successfully!'
    );

        setDate('');
        setCost('');
        setDescription('');
        setExpenseType('');
        setEditingId(null);
        setErrors({});

        await loadExpenses();
    } else {
        const data = await response.json();

        if (data.errors) {
            setErrors(data.errors);
        } else {
            alert('Failed to save expense.');
        }
    }
}

    return (
        <>
            <Head title="Expense Manager" />

            <div className="min-h-screen bg-gray-100 p-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-2 text-3xl font-bold">
                        Expense Manager
                    </h1>

                    <p className="mb-6 text-gray-600">
                        Track and manage your daily expenses.
                    </p>

                    {statusMessage && (
                        <p
                            aria-live="polite"
                            className="mt-3 text-sm text-green-700"
                        >
                            {statusMessage}
                        </p>
                    )}

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Add Expense
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="date"
                                    className="mb-1 block font-medium"
                                >
                                    Date
                                </label>

                               <input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    aria-describedby={errors.date ? 'date-error' : undefined}
                                    className="w-full rounded border p-2"
                                />
                                {errors.date && (
                                    <p id="date-error" className="mt-1 text-sm text-red-600">
                                        {errors.date[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="cost"
                                    className="mb-1 block font-medium"
                                >
                                    Cost
                                </label>

                                <input
                                    id="cost"
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    aria-describedby={errors.cost ? 'cost-error' : undefined}
                                    className="w-full rounded border p-2"
                                    placeholder="Enter cost"
                                />
                                {errors.cost && (
                                    <p id="cost-error" className="mt-1 text-sm text-red-600">
                                        {errors.cost[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-1 block font-medium"
                                >
                                    Description
                                </label>

                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    aria-describedby={
                                         errors.description ? 'description-error' : undefined
                                    }
                                    className="w-full rounded border p-2"
                                    placeholder="Enter description"
                                />
                                {errors.description && (
                                   <p id="description-error" className="mt-1 text-sm text-red-600">
                                        {errors.description[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                               <label
                                    htmlFor="expenseType"
                                    className="mb-1 block font-medium"
                                >
                                    Expense Type
                                </label>

                                <input
                                    id="expenseType"
                                    type="text"
                                    value={expenseType}
                                    onChange={(e) =>
                                        setExpenseType(e.target.value)
                                    }
                                    aria-describedby={
                                        errors.expense_type ? 'expense-type-error' : undefined
                                    }
                                    className="w-full rounded border p-2"
                                    placeholder="e.g. food"
                                />
                                {errors.expense_type && (
                                    <p id="expense-type-error" className="mt-1 text-sm text-red-600">
                                        {errors.expense_type[0]}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded bg-black px-4 py-2 text-white"
                            >
                                {editingId ? 'Update Expense' : 'Add Expense'}
                                
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setDate('');
                                        setCost('');
                                        setDescription('');
                                        setExpenseType('');
                                        setErrors({});
                                    }}
                                    className="rounded bg-gray-500 px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>
                            )}
                            </div>
                        </form>
                    </div>
                    <div className="mt-8 rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-4 text-xl font-semibold">
                                Expense List
                            </h2>

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by description or type"
                                aria-label="Search expenses"
                                className="mb-4 w-full rounded border p-2"
                            />

                            {filteredExpenses.length === 0 ? (
                                <p className="text-gray-500">
                                    No expenses found.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {filteredExpenses.map((expense) => (
                                        <div
                                            key={expense.id}
                                            className="rounded border p-4"
                                        >
                                            <div
                                                id={`expense-${expense.id}-description`}
                                                className="font-semibold"
                                            >
                                                {expense.description}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                Date: {expense.date.substring(0, 10)}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                Cost: Rs. {expense.cost}
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                Type: {expense.expense_type}
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(expense)}
                                                    aria-describedby={`expense-${expense.id}-description`}
                                                    className="rounded bg-blue-600 px-3 py-1 text-white"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                        type="button"
                                                        onClick={() => handleDelete(expense.id)}
                                                        aria-describedby={`expense-${expense.id}-description`}
                                                        className="rounded bg-red-600 px-3 py-1 text-white"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    
                </div>
            </div>
        </>
    );
}