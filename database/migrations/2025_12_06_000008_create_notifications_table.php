<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->constrained('students')->onDelete('cascade');
            $table->string('type'); // 'approval', 'due_reminder', 'overdue', 'announcement'
            $table->string('title');
            $table->text('message');
            $table->string('subject')->nullable();
            $table->enum('channel', ['email', 'sms', 'in_app', 'all'])->default('all');
            $table->boolean('is_sent')->default(false);
            $table->datetime('sent_at')->nullable();
            $table->boolean('is_read')->default(false);
            $table->datetime('read_at')->nullable();
            $table->text('send_error')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['type', 'is_sent', 'student_id']);
            $table->index(['created_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('notifications');
    }
};
