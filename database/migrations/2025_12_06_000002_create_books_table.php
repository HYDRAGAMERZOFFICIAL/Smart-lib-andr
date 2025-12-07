<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('edition')->nullable();
            $table->string('publisher')->nullable();
            $table->string('isbn')->nullable()->unique();
            $table->string('category');
            $table->string('rack')->nullable();
            $table->string('shelf')->nullable();
            $table->string('course')->nullable();
            $table->string('semester')->nullable();
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->integer('total_copies')->default(0);
            $table->integer('available_copies')->default(0);
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['category', 'course', 'semester']);
            $table->fullText(['title', 'author', 'category']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('books');
    }
};
