import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import Expenses from '../pages/expenses';

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
}));

beforeEach(() => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        }),
    );
});

test('renders the expense manager page', async () => {
    render(<Expenses />);

    expect(
        screen.getByRole('heading', { name: 'Expense Manager' })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('heading', { name: 'Add Expense' })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('heading', { name: 'Expense List' })
    ).toBeInTheDocument();

    expect(
        screen.getByRole('button', { name: 'Add Expense' })
    ).toBeInTheDocument();
});

test('displays expenses returned from the API', async () => {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                {
                    id: 1,
                    date: '2026-08-28',
                    cost: '2500.00',
                    description: 'Dinner',
                    expense_type: 'food',
                },
            ],
        }),
    );

    render(<Expenses />);

    expect(await screen.findByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText(/2500/)).toBeInTheDocument();
    expect(screen.getByText(/food/)).toBeInTheDocument();
});

test('creates a new expense successfully', async () => {
  const user = userEvent.setup();

  vi.stubGlobal(
    'fetch',
    vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          date: '2026-08-28',
          cost: '1200.00',
          description: 'Lunch',
          expense_type: 'food',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      }),
  );

  render(<Expenses />);

  await user.type(screen.getByLabelText('Date'), '2026-08-28');
  await user.type(screen.getByLabelText('Cost'), '1200');
  await user.type(screen.getByLabelText('Description'), 'Lunch');
  await user.type(screen.getByLabelText('Expense Type'), 'food');

  await user.click(
    screen.getByRole('button', { name: 'Add Expense' }),
  );

  expect(fetch).toHaveBeenCalledWith(
    '/api/expenses',
    expect.objectContaining({
      method: 'POST',
    }),
  );
});

test('displays validation errors for empty required fields', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
        'fetch',
        vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 422,
                json: async () => ({
                    errors: {
                        date: ['The date field is required.'],
                        cost: ['The cost field is required.'],
                        description: ['The description field is required.'],
                        expense_type: ['The expense type field is required.'],
                    },
                }),
            }),
    );

    render(<Expenses />);

    await user.click(
        screen.getByRole('button', { name: 'Add Expense' }),
    );

    expect(
        await screen.findByText('The date field is required.')
    ).toBeInTheDocument();

    expect(
        screen.getByText('The cost field is required.')
    ).toBeInTheDocument();

    expect(
        screen.getByText('The description field is required.')
    ).toBeInTheDocument();

    expect(
        screen.getByText('The expense type field is required.')
    ).toBeInTheDocument();
});

test('deletes an expense successfully', async () => {
  const user = userEvent.setup();

  vi.stubGlobal('confirm', vi.fn(() => true));
  vi.stubGlobal('alert', vi.fn());

  const fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          date: '2026-08-28',
          cost: '2500.00',
          description: 'Dinner',
          expense_type: 'food',
        },
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

  vi.stubGlobal('fetch', fetch);

  render(<Expenses />);

  expect(
    await screen.findByText('Dinner'),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Delete' }),
  );

  expect(fetch).toHaveBeenCalledWith(
    '/api/expenses/1',
    expect.objectContaining({
      method: 'DELETE',
    }),
  );
});

test('updates an expense successfully', async () => {
  const user = userEvent.setup();

  vi.stubGlobal('alert', vi.fn());

  const fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          date: '2026-08-28',
          cost: '2500.00',
          description: 'Dinner',
          expense_type: 'food',
        },
      ],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        date: '2026-08-28',
        cost: '3000.00',
        description: 'Dinner Updated',
        expense_type: 'food',
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

  vi.stubGlobal('fetch', fetch);

  render(<Expenses />);

  expect(
    await screen.findByText('Dinner'),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Edit' }),
  );

  const costInput = screen.getByLabelText('Cost');
  const descriptionInput = screen.getByLabelText('Description');

  await user.clear(costInput);
  await user.type(costInput, '3000');

  await user.clear(descriptionInput);
  await user.type(descriptionInput, 'Dinner Updated');

  await user.click(
    screen.getByRole('button', { name: 'Update Expense' }),
  );

  expect(fetch).toHaveBeenCalledWith(
    '/api/expenses/1',
    expect.objectContaining({
      method: 'PUT',
    }),
  );
});

test('cancels editing and returns to add mode', async () => {
  const user = userEvent.setup();

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          date: '2026-08-28',
          cost: '3000.00',
          description: 'Dinner Updated',
          expense_type: 'food',
        },
      ],
    }),
  );

  render(<Expenses />);

  expect(
    await screen.findByText('Dinner Updated'),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Edit' }),
  );

  expect(
    screen.getByRole('button', { name: 'Update Expense' }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'Cancel' }),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Cancel' }),
  );

  expect(
    screen.getByRole('button', { name: 'Add Expense' }),
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('button', { name: 'Cancel' }),
  ).not.toBeInTheDocument();
});

test('does not delete an expense when confirmation is cancelled', async () => {
  const user = userEvent.setup();

  vi.stubGlobal('confirm', vi.fn(() => false));

  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 1,
        date: '2026-08-28',
        cost: '2500.00',
        description: 'Dinner',
        expense_type: 'food',
      },
    ],
  });

  vi.stubGlobal('fetch', fetch);

  render(<Expenses />);

  expect(
    await screen.findByText('Dinner'),
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Delete' }),
  );

  expect(fetch).not.toHaveBeenCalledWith(
    '/api/expenses/1',
    expect.objectContaining({
      method: 'DELETE',
    }),
  );
});

test('filters expenses using the search box', async () => {
  const user = userEvent.setup();

  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 1,
        date: '2026-08-28',
        cost: '2500.00',
        description: 'Dinner',
        expense_type: 'food',
      },
      {
        id: 2,
        date: '2026-08-29',
        cost: '5000.00',
        description: 'Bus Ticket',
        expense_type: 'travel',
      },
    ],
  });

  vi.stubGlobal('fetch', fetch);

  render(<Expenses />);

  expect(
    await screen.findByText('Dinner'),
  ).toBeInTheDocument();

  expect(
    await screen.findByText('Bus Ticket'),
  ).toBeInTheDocument();

  const searchBox = screen.getByRole('searchbox', {
    name: 'Search expenses',
  });

  await user.type(searchBox, 'food');

  expect(screen.getByText('Dinner')).toBeInTheDocument();
  expect(screen.queryByText('Bus Ticket')).not.toBeInTheDocument();
});