use anchor_lang::prelude::*;
use std::mem::size_of;

pub mod errors;
pub mod states;
pub mod constants;
use crate::{states::*, constants::*, errors::*};

declare_id!("7AL1ZrQT9ehdtJFiEd3gnJgLJg9hki1C1nhujfncSPMV");

#[program]
pub mod solana_dao {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_feat = 0;
        user_profile.feat_count = 0;
        //user_profile.user_type = _user_type;
        Ok(())
    }

    pub fn add_features(ctx: Context<AddFeatures>, _content: String, _company_idx: u8, _vote_period: i64) -> Result<()> {
        
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;
        let user_profile = &mut ctx.accounts.user_profile;
        let feature_list = &mut ctx.accounts.feature_list;

        feature_list.authority = ctx.accounts.authority.key();
        feature_list.content = _content;
        feature_list.idx = user_profile.last_feat;
        feature_list.company_idx = _company_idx;
        feature_list.vote_period = current_timestamp + _vote_period;
        feature_list.vote_complete = false;

        user_profile.last_feat = user_profile.last_feat.checked_add(1).unwrap();

        user_profile.feat_count = user_profile.feat_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn add_voting(ctx: Context<AddVoting>, _feature_idx: u8, _company_idx: u8, _vote: u8) -> Result<()> {
        let voting_list = &mut ctx.accounts.voting_list;
        let vote: VoteType = VoteType::new(_vote).unwrap();

        voting_list.authority = ctx.accounts.authority.key();
        voting_list.feature_idx = _feature_idx;
        voting_list.company_idx = _company_idx;
        voting_list.vote_check = true;
        voting_list.idx = voting_list.idx.checked_add(1).unwrap();
        voting_list.vote_count = voting_list.vote_count.checked_add(1).unwrap();
        voting_list.vote = vote;

        Ok(())
    }

    pub fn add_company(ctx: Context<AddCompany>, _company_name: String, _about: String) -> Result<()> {
        let company_list = &mut ctx.accounts.company_list;
        company_list.authority = ctx.accounts.authority.key();
        company_list.company_name = _company_name;
        company_list.about = _about;
        Ok(())
    }

    pub fn add_member(ctx: Context<AddMember>, _company_idx: u8) -> Result<()> {
        let member_list = &mut ctx.accounts.member_list;

        member_list.authority = ctx.accounts.authority.key();
        member_list.company_idx = _company_idx;
        member_list.idx = member_list.idx.checked_add(1).unwrap();
        member_list.member_count = member_list.member_count.checked_add(1).unwrap();
        member_list.joined = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<UserProfile>(),
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddFeatures<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [FEATURE_TAG, authority.key().as_ref(), &[user_profile.last_feat as u8].as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<FeatureList>(),
    )]
    pub feature_list: Box<Account<'info, FeatureList>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddVoting<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [VOTE_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<VoteList>()
    )]
    pub voting_list: Box<Account<'info, VoteList>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct AddCompany<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [COMPANY_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<CompanyList>()
    )]
    pub company_list: Box<Account<'info, CompanyList>>,

    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction()]
pub struct AddMember<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [MEMBER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + size_of::<MemberList>()

    )]
    pub member_list: Box<Account<'info, MemberList>>,

    pub system_program: Program<'info, System>,
}

pub fn bump(seeds: &[&[u8]], program_id: &Pubkey) -> u8 {
    let (_found_key, bump) = Pubkey::find_program_address(seeds, program_id);
    bump
}

impl VoteType {
    pub fn new(hand: u8) -> Result<Self> {
        match hand {
            0 => Ok(VoteType::For),
            1 => Ok(VoteType::Against),
            2 => Ok(VoteType::Abstain),
            _ => Err(AppError::NotVotingOption.into()),
        }
    }
}

impl Default for VoteType {
    fn default() -> Self {
        VoteType::Abstain
    }
}



