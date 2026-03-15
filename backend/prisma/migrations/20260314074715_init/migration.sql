-- CreateEnum
CREATE TYPE "ChamaType" AS ENUM ('merry_go_round', 'investment', 'welfare', 'hybrid');

-- CreateEnum
CREATE TYPE "ContributionFrequency" AS ENUM ('weekly', 'biweekly', 'monthly');

-- CreateEnum
CREATE TYPE "ChamaStatus" AS ENUM ('active', 'suspended', 'closed');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('chairperson', 'treasurer', 'secretary', 'member');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('active', 'suspended', 'exited');

-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('upcoming', 'active', 'collecting', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'stk_sent', 'paid', 'partial', 'late', 'waived');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('contribution', 'penalty', 'loan_disbursement', 'loan_repayment', 'mgr_payout', 'investment', 'withdrawal');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'reversed');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('pending_vote', 'approved', 'active', 'completed', 'defaulted', 'rejected');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('yes', 'no', 'abstain');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('upcoming', 'current', 'completed');

-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('pending', 'accepted', 'declined', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "BankLoanOfferStatus" AS ENUM ('available', 'applied', 'approved', 'disbursed', 'expired');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone_number" VARCHAR(15) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "national_id" VARCHAR(20),
    "profile_photo_url" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone_number" VARCHAR(15) NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "chama_type" "ChamaType" NOT NULL,
    "mgr_percentage" INTEGER NOT NULL DEFAULT 0,
    "investment_percentage" INTEGER NOT NULL DEFAULT 0,
    "welfare_percentage" INTEGER NOT NULL DEFAULT 0,
    "contribution_amount" DECIMAL(12,2) NOT NULL,
    "contribution_frequency" "ContributionFrequency" NOT NULL,
    "meeting_day" INTEGER,
    "penalty_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "penalty_grace_days" INTEGER NOT NULL DEFAULT 3,
    "max_loan_multiplier" DECIMAL(4,2) NOT NULL DEFAULT 3.0,
    "loan_interest_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.0,
    "min_votes_to_approve_loan" INTEGER NOT NULL DEFAULT 0,
    "mgr_pot_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "investment_fund_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "welfare_pot_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_by" UUID NOT NULL,
    "status" "ChamaStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "chamas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chama_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MemberStatus" NOT NULL DEFAULT 'active',
    "exit_at" TIMESTAMPTZ(6),
    "total_contributed" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "chama_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribution_cycles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "cycle_number" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "collection_date" DATE,
    "expected_amount" DECIMAL(12,2) NOT NULL,
    "collected_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "CycleStatus" NOT NULL DEFAULT 'upcoming',
    "mgr_recipient_id" UUID,
    "mgr_payout_amount" DECIMAL(12,2),
    "mgr_paid_out" BOOLEAN NOT NULL DEFAULT false,
    "mgr_payout_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contribution_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cycle_id" UUID NOT NULL,
    "chama_member_id" UUID NOT NULL,
    "expected_amount" DECIMAL(12,2) NOT NULL,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "penalty_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "due_date" DATE NOT NULL,
    "paid_at" TIMESTAMPTZ(6),
    "stk_sent_at" TIMESTAMPTZ(6),
    "reminder_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "user_id" UUID,
    "transaction_type" "TransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "direction" "TransactionDirection" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "idempotency_key" VARCHAR(100) NOT NULL,
    "mpesa_checkout_request_id" VARCHAR(100),
    "mpesa_receipt_number" VARCHAR(50),
    "mpesa_phone_number" VARCHAR(15),
    "mpesa_result_code" INTEGER,
    "mpesa_result_desc" TEXT,
    "reference_id" UUID,
    "reference_type" VARCHAR(50),
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "borrower_member_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "repayment_months" INTEGER NOT NULL,
    "monthly_repayment" DECIMAL(12,2) NOT NULL,
    "total_repayable" DECIMAL(12,2) NOT NULL,
    "amount_repaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "purpose" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'pending_vote',
    "disbursed_at" TIMESTAMPTZ(6),
    "due_date" DATE,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_votes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "loan_id" UUID NOT NULL,
    "voter_member_id" UUID NOT NULL,
    "vote" "VoteChoice" NOT NULL,
    "voted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mgr_schedule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "chama_member_id" UUID NOT NULL,
    "cycle_number" INTEGER NOT NULL,
    "original_cycle_number" INTEGER NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'upcoming',
    "received_amount" DECIMAL(12,2),
    "received_at" TIMESTAMPTZ(6),

    CONSTRAINT "mgr_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swap_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID NOT NULL,
    "requester_member_id" UUID NOT NULL,
    "target_member_id" UUID NOT NULL,
    "requester_cycle" INTEGER NOT NULL,
    "target_cycle" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "SwapStatus" NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "responded_at" TIMESTAMPTZ(6),
    "chairperson_notified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swap_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chama_id" UUID,
    "actor_id" UUID,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" VARCHAR(45),
    "device_id" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_scores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "payment_consistency_score" INTEGER,
    "loan_repayment_score" INTEGER,
    "tenure_score" INTEGER,
    "contribution_growth_score" INTEGER,
    "penalty_record_score" INTEGER,
    "total_months_tracked" INTEGER,
    "total_contributed" DECIMAL(12,2),
    "chamas_count" INTEGER,
    "consecutive_on_time" INTEGER,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_loan_offers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "credit_score_id" UUID NOT NULL,
    "bank_name" VARCHAR(100) NOT NULL,
    "max_amount" DECIMAL(12,2) NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "min_months" INTEGER NOT NULL,
    "max_months" INTEGER NOT NULL,
    "status" "BankLoanOfferStatus" NOT NULL DEFAULT 'available',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "applied_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "referral_fee_paid" BOOLEAN NOT NULL DEFAULT false,
    "referral_fee_amount" DECIMAL(12,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_loan_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "otp_codes_phone_number_idx" ON "otp_codes"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "chama_members_chama_id_user_id_key" ON "chama_members"("chama_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_idempotency_key_key" ON "transactions"("idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "loan_votes_loan_id_voter_member_id_key" ON "loan_votes"("loan_id", "voter_member_id");

-- CreateIndex
CREATE UNIQUE INDEX "mgr_schedule_chama_id_cycle_number_key" ON "mgr_schedule"("chama_id", "cycle_number");

-- AddForeignKey
ALTER TABLE "chamas" ADD CONSTRAINT "chamas_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chama_members" ADD CONSTRAINT "chama_members_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chama_members" ADD CONSTRAINT "chama_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution_cycles" ADD CONSTRAINT "contribution_cycles_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution_cycles" ADD CONSTRAINT "contribution_cycles_mgr_recipient_id_fkey" FOREIGN KEY ("mgr_recipient_id") REFERENCES "chama_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "contribution_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_chama_member_id_fkey" FOREIGN KEY ("chama_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_member_id_fkey" FOREIGN KEY ("borrower_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_votes" ADD CONSTRAINT "loan_votes_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_votes" ADD CONSTRAINT "loan_votes_voter_member_id_fkey" FOREIGN KEY ("voter_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mgr_schedule" ADD CONSTRAINT "mgr_schedule_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mgr_schedule" ADD CONSTRAINT "mgr_schedule_chama_member_id_fkey" FOREIGN KEY ("chama_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swap_requests" ADD CONSTRAINT "swap_requests_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swap_requests" ADD CONSTRAINT "swap_requests_requester_member_id_fkey" FOREIGN KEY ("requester_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swap_requests" ADD CONSTRAINT "swap_requests_target_member_id_fkey" FOREIGN KEY ("target_member_id") REFERENCES "chama_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_chama_id_fkey" FOREIGN KEY ("chama_id") REFERENCES "chamas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_scores" ADD CONSTRAINT "credit_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loan_offers" ADD CONSTRAINT "bank_loan_offers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_loan_offers" ADD CONSTRAINT "bank_loan_offers_credit_score_id_fkey" FOREIGN KEY ("credit_score_id") REFERENCES "credit_scores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
