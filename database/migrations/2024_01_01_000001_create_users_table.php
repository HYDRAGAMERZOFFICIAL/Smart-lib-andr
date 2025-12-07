<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('id_number')->unique()->comment('Student ID Number');
            $table->string('name')->comment('Full Name');
            $table->string('email')->nullable()->unique()->comment('Student Email');
            $table->string('phone')->comment('Phone Number');
            $table->string('department')->comment('Department/Faculty');
            $table->string('semester')->comment('Current Semester');
            $table->string('password')->comment('Hashed Password');
            $table->string('profile_image')->nullable()->comment('Profile Photo Path');
            $table->boolean('is_approved')->default(false)->comment('Admin Approval Status');
            $table->rememberToken();
            $table->timestamps();
            
            $table->index('id_number');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
