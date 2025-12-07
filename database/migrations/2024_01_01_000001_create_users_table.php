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
            $table->string('id_number')->unique();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone');
            $table->string('department');
            $table->string('semester');
            $table->string('password');
            $table->string('profile_image')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
