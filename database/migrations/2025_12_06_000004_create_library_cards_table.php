<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('library_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('card_number')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->string('qr_code')->nullable();
            $table->enum('status', ['active', 'inactive', 'lost', 'pending_replacement'])->default('active');
            $table->date('issued_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->date('lost_date')->nullable();
            $table->string('issued_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['student_id', 'status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('library_cards');
    }
};
