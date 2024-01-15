use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    //pub user_type: u8,
    pub last_feat: u8,
    pub feat_count: u8,
}

#[account]
#[derive(Default)]
pub struct FeatureList {
    pub authority: Pubkey,
    pub content: String,
    pub idx: u8,
    pub company_idx: u8,
    pub vote_complete: bool,
    pub vote_period: i64,
}

#[account]
#[derive(Default)]
pub struct VoteList {
    pub authority: Pubkey,
    pub vote_count: u8,
    pub idx: u8,
    pub vote_check: bool,
    pub feature_idx: u8,
    pub company_idx: u8,
    pub vote: VoteType,
}

#[account]
#[derive(Default)]
pub struct CompanyList {
    pub authority: Pubkey,
    pub company_name: String,
    pub company_image_url: String,
    pub about: String,
}

#[account]
#[derive(Default)]
pub struct MemberList {
    pub authority: Pubkey,
    pub company_idx: u8,
    pub member_count: u8,
    pub idx: u8,
    pub joined: bool,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum VoteType {
    For,
    Against,
    Abstain,
}



