const vipMembersController = {
    listVipMembers: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('vip_member/list_vip_member');
    }, 
}

module.exports = vipMembersController