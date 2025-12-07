<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('academic_calendar_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['holiday', 'exam', 'library_closed', 'event'])->default('event');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_published')->default(true);
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['type', 'start_date']);
            $table->index(['is_published']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('academic_calendar_events');
    }
};
