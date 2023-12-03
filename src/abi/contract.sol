pragma solidity >=0.4.24 <=0.5.6;
contract NFTSimple {
    string public name = "KlayLion";
    string public symbol = "KL";

    mapping(uint256 => address) public tokenOwner;
    mapping(uint256 => string) public tokenURIs;
    mapping(address => uint256[]) private _ownedTokens; 
    //onKIP17Received bytes value
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    function mintWithTokenURI(address to, uint256 tokenId,string memory tokenURI) public returns (bool){
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;

        _ownedTokens[to].push(tokenId);
        return true;
    }
    function changeNFT(address from,string memory image, uint256 requireCoupon) public {
        uint256 cnt = 0;
        uint256 [] memory deleteTokenId = new uint256[](requireCoupon);
        for(uint256 i =0;i<_ownedTokens[from].length;i++){
            if(keccak256(abi.encodePacked(tokenURIs[_ownedTokens[from][i]])) == keccak256(abi.encodePacked(image))){
                if(cnt == requireCoupon) break;
                deleteTokenId[cnt] = _ownedTokens[from][i];
                cnt ++;
            }
        }
        if(cnt == requireCoupon){
            for(uint256 i =0;i<deleteTokenId.length;i++){
                burn(from,deleteTokenId[i]);
            }
            mintWithTokenURI(from,1000,"product");
        }
    }
    
    function burn(address owner, uint256 tokenId) public {
        uint256 lastTokenId = _ownedTokens[owner][_ownedTokens[owner].length-1];
        for(uint256 i=0;i<_ownedTokens[owner].length;i++){
            if(tokenId == _ownedTokens[owner][i]){
                uint256 temp = tokenId;
                _ownedTokens[owner][i] = lastTokenId;
                _ownedTokens[owner][_ownedTokens[owner].length-1] = temp;
                break;
            }
        }
        _ownedTokens[owner].length --;
	
    }

    function safeTransforFrom(address from, address to, uint256 tokenId, bytes memory _data) public{
        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "you're not the owner of the token");
         _removeTokenFromList(from,tokenId);
         _ownedTokens[to].push(tokenId);
        tokenOwner[tokenId] = to;

        //만약 받는쪽이 실행할 코드가 있는 컨트랙트라면 실행
        require(
            _checkOnKIP17Received(from,to,tokenId,_data),"KIP17: transfer to non KIP17Receiver implementer"
        );
    }

    function _checkOnKIP17Received(address from,address to,uint256 tokenId,bytes memory _data) private returns(bool){
        bool success;
        bytes memory returndata;

        if(!isContract(to)){
            return true;
        }
        (success, returndata) = to.call(
            abi.encodeWithSelector(
                _KIP17_RECEIVED,
                msg.sender,
                from,
                tokenId,
                _data
            )
        );
        if(
            returndata.length != 0 &&
            abi.decode(returndata,(bytes4)) == _KIP17_RECEIVED
        ){
            return true;
        }
        return false;
    }

    function isContract(address account) internal view returns(bool){
        uint256 size;
        assembly { size := extcodesize(account)}
        return size > 0;
    }

    function _removeTokenFromList(address from,uint256 tokenId) private{
        uint256 lastTokenId = _ownedTokens[from][_ownedTokens[from].length-1];
        for(uint256 i=0;i<_ownedTokens[from].length;i++){
            if(tokenId == _ownedTokens[from][i]){
                uint256 temp = tokenId;
                _ownedTokens[from][i] = lastTokenId;
                _ownedTokens[from][_ownedTokens[from].length-1] = temp;
                break;
            }
        }
        _ownedTokens[from].length --;
    }

    function ownderTokens(address owner) public view returns(uint256[] memory){
        return _ownedTokens[owner];
    }

    function setTokenUri(uint256 id, string memory uri) public{
        tokenURIs[id] = uri;
    }
    function balanceOf(address owner) public view returns (uint256) {
        require(
            owner != address(0),
            "KIP17: balance query for the zero address"
        );

        return _ownedTokens[owner].length;
    }


}

contract NFTMarket{
    mapping(uint256 => address) public seller;

    function buyNFT(uint256 tokenId, address to) public payable returns (bool){
        address payable receiver = address(uint160(seller[tokenId]));
        receiver.transfer(10**14);
        NFTSimple(to).safeTransforFrom(address(this),msg.sender,tokenId,'0x00');
        return true;
    }
    //판매대에 올렸을 때 판매자가 누구인지 기록
    function onKIP17Received(address operator, address from, uint256 tokenId,bytes memory data ) public returns (bytes4){
        seller[tokenId] = from;
        return bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    }
}
