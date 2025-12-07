<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('book_copies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->string('copy_code')->unique();
            $table->string('barcode')->unique();
            $table->enum('status', ['available', 'issued', 'lost', 'damaged'])->default('available');
            $table->text('condition_notes')->nullable();
            $table->date('acquisition_date')->nullable();
            $table->date('last_maintenance_date')->nullable();
            $table->text('maintenance_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'book_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('book_copies');
    }
};
