<?php

use App\Models\Expense;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('can create an expense', function () {
    $response = $this->postJson('/api/expenses', [
        'date' => '2026-08-27',
        'cost' => 1500,
        'description' => 'Lunch',
        'expense_type' => 'food',
    ]);

    $response
        ->assertStatus(201)
        ->assertJson([
            'description' => 'Lunch',
            'expense_type' => 'food',
        ]);

    $this->assertDatabaseHas('expenses', [
        'description' => 'Lunch',
        'expense_type' => 'food',
    ]);
});

test('can list all expenses', function () {
    Expense::create([
        'date' => '2026-08-27',
        'cost' => 1500,
        'description' => 'Lunch',
        'expense_type' => 'food',
    ]);

    $response = $this->getJson('/api/expenses');

    $response
        ->assertStatus(200)
        ->assertJsonCount(1)
        ->assertJsonFragment([
            'description' => 'Lunch',
            'expense_type' => 'food',
        ]);
});

test('can show a single expense', function () {
    $expense = Expense::create([
        'date' => '2026-08-27',
        'cost' => 2000,
        'description' => 'Dinner',
        'expense_type' => 'food',
    ]);

    $response = $this->getJson('/api/expenses/'.$expense->id);

    $response
        ->assertStatus(200)
        ->assertJson([
            'description' => 'Dinner',
            'expense_type' => 'food',
        ]);
});

test('can update an expense', function () {
    $expense = Expense::create([
        'date' => '2026-08-27',
        'cost' => 1500,
        'description' => 'Lunch',
        'expense_type' => 'food',
    ]);

    $response = $this->putJson('/api/expenses/'.$expense->id, [
        'date' => '2026-08-28',
        'cost' => 2500,
        'description' => 'Dinner',
        'expense_type' => 'food',
    ]);

    $response
        ->assertStatus(200)
        ->assertJson([
            'description' => 'Dinner',
            'cost' => '2500.00',
        ]);

    $this->assertDatabaseHas('expenses', [
        'id' => $expense->id,
        'description' => 'Dinner',
        'cost' => 2500,
    ]);
});

test('can delete an expense', function () {
    $expense = Expense::create([
        'date' => '2026-08-27',
        'cost' => 1500,
        'description' => 'Lunch',
        'expense_type' => 'food',
    ]);

    $response = $this->deleteJson('/api/expenses/'.$expense->id);

    $response
        ->assertStatus(200)
        ->assertJson([
            'message' => 'Expense deleted successfully',
        ]);

    $this->assertDatabaseMissing('expenses', [
        'id' => $expense->id,
    ]);
});

test('cannot create an expense with invalid data', function () {
    $response = $this->postJson('/api/expenses', [
        'date' => '',
        'cost' => -100,
        'description' => '',
        'expense_type' => '',
    ]);

    $response
        ->assertStatus(422)
        ->assertJsonValidationErrors([
            'date',
            'cost',
            'description',
            'expense_type',
        ]);

    $this->assertDatabaseCount('expenses', 0);
});
