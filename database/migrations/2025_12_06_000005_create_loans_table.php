<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('book_copy_id')->constrained('book_copies')->onDelete('cascade');
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->datetime('issued_date');
            $table->datetime('due_date');
            $table->datetime('returned_date')->nullable();
            $table->enum('status', ['active', 'returned', 'lost', 'overdue'])->default('active');
            $table->decimal('fine_amount', 10, 2)->default(0);
            $table->boolean('fine_paid')->default(false);
            $table->datetime('fine_paid_date')->nullable();
            $table->string('issued_by')->nullable();
            $table->string('returned_by')->nullable();
            $table->text('return_notes')->nullable();
            $table->text('damage_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'status', 'due_date']);
            $table->index(['book_id', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('loans');
    }
};
