<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('loan_id')->nullable()->constrained('loans')->onDelete('set null');
            $table->string('type'); // 'overdue', 'damage', 'lost_book'
            $table->text('description');
            $table->decimal('amount', 10, 2);
            $table->datetime('due_date');
            $table->enum('status', ['pending', 'paid', 'waived', 'write_off'])->default('pending');
            $table->datetime('paid_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->text('payment_notes')->nullable();
            $table->string('waived_by')->nullable();
            $table->text('waive_reason')->nullable();
            $table->datetime('waived_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'status']);
            $table->index(['due_date', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('fines');
    }
};
