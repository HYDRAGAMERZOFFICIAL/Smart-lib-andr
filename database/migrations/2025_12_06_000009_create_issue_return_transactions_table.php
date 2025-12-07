<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('issue_return_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('book_copy_id')->constrained('book_copies')->onDelete('cascade');
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            $table->enum('type', ['issue', 'return'])->default('issue');
            $table->datetime('transaction_date');
            $table->string('processed_by')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_successful')->default(true);
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'type', 'transaction_date']);
            $table->index(['book_id', 'type']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('issue_return_transactions');
    }
};
