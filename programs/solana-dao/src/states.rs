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
}

#[account]
#[derive(Default)]
pub struct CompanyList {
    pub authority: Pubkey,
    pub company_name: String,
    pub company_image_url: String,
}