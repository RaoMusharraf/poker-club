import { Program, AnchorProvider } from '@project-serum/anchor';
import { SwapABI, SwapAddress, marketplaceABI, marketplaceAddress } from "../store/contract/index";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";


const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const provider = new AnchorProvider(connection, window.solana, AnchorProvider.defaultOptions());
const program = new Program(SwapABI, new PublicKey(SwapAddress), provider);
const mkt_program = new Program(marketplaceABI, new PublicKey(marketplaceAddress), provider);

export { provider, program, mkt_program, connection };