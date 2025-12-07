<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('id_number')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('department');
            $table->string('course');
            $table->string('semester');
            $table->enum('status', ['pending', 'approved', 'rejected', 'blocked'])->default('pending');
            $table->text('address')->nullable();
            $table->string('photo')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->datetime('approved_at')->nullable();
            $table->datetime('rejected_at')->nullable();
            $table->datetime('blocked_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'department', 'semester']);
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::dropIfExists('students');
    }
};
