import EventBus from 'eventing-bus';
import { web3, BN } from '@project-serum/anchor';
import { PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import React, { useMemo, useState, useEffect } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import Loader from "../../components/Loader/index"

import './index.css';
import { SwapAddress, marketplaceAddress } from "../../store/contract/index";
import { program, provider, mkt_program } from "../../store/solanaProvider";

import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from "../../store/actions/Auth";

const programID = new PublicKey(SwapAddress);

const ConversionRate = () => {
    const network = clusterApiUrl('devnet');
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    const [isGoldRate, setIsGoldRate] = useState(false);
    const [isTimeRate, setIsTimeRate] = useState(false);
    const [addTokens, setAddTokens] = useState("");
    const [goldRateModal, toggleGoldRateModal] = useState(false);
    const [timeRateModal, toggleTimeRateModal] = useState(false);
    const [addTokensModal, toggleAddTokensModal] = useState(false);
    const [rateGoldToMPC, setRateGoldToMPC] = useState("");
    const [rateTimeToMPC, setRateTimeToMPC] = useState("");
    const [hardWalletTokens, sethardWalletTokens] = useState(0);
    const [currentGoldToMpcValue, setCurrentGoldToMpcValue] = useState(0);
    const [currentTimeToMpcValue, setCurrentTimeToMpcValue] = useState(0);

    const dispatch = useDispatch();
    const { isLoader } = useSelector(({ Auth }) => ({
        isLoader: Auth.isLoader
    }))

    useEffect(() => {
        dispatch(setLoader(false));
        getGoldRate();
        getTimeRate();
        getMPCTokens();
    }, [dispatch]);

    const getGoldRate = async () => {
        try {
            const [vaultPda, _] = PublicKey.findProgramAddressSync(
                [Buffer.from('Account55')],
                programID
            );
            const data = await program.account.solAccount.fetch(vaultPda);
            const currentRate = data.goldToMpcValue.toString();
            setCurrentGoldToMpcValue(currentRate);
        } catch (error) {
            if (error) setIsGoldRate(true);
        }
    };
    const getMPCTokens = async () => {
        try {
            const [vaultPda, _] = PublicKey.findProgramAddressSync(
                [Buffer.from('Account55')],
                programID
            );
            const data = await program.account.solAccount.fetch(vaultPda);
            const currentTokens = data.mpcCoins.toString();
            sethardWalletTokens(currentTokens);
        } catch (error) {
            if (error) setIsGoldRate(true);
        }
    };

    const getTimeRate = async () => {
        try {
            const [vaultPda, _] = PublicKey.findProgramAddressSync(
                [Buffer.from('vault03')],
                programID
            );
            const data = await program.account.coins.fetch(vaultPda);
            const currentRate = data.timeCoins.toString();
            setCurrentTimeToMpcValue(currentRate);
        } catch (error) {
            if (error) setIsTimeRate(true);
        }
    };

    const submit = async () => {
        try {
            if (true) {
                const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
                const METADATA_PREFIX = "metadata";
                const EDITION_SUFFIX = "edition";

                const amount = new BN(1_000); // Replace with the amount you want
                const expireInSec = new BN(60 * 60 * 24); // Optional expiration time in seconds
                const currency = null; // Replace with currency Pubkey if required
                const privateTaker = null; // Replace with private taker Pubkey if required
                const makerBroker = null; // Replace with maker broker Pubkey if required
                const authorizationData = null; // Replace with authorization data if required
                const mintHash = new PublicKey("6f5r9THztjzBus55SajDocZJ2Uno5n1jafYNmcNgHWLw");
                const marketplaceProgram = new PublicKey(marketplaceAddress);

                //Accounts
                let ownerATA = await getAssociatedTokenAddress(mintHash, provider.wallet.publicKey);
                let [listStateAccount] = PublicKey.findProgramAddressSync([Buffer.from('list_state'), mintHash.toBuffer()], marketplaceProgram);
                let [listStateATA] = PublicKey.findProgramAddressSync([listStateAccount.toBuffer(), mintHash.toBuffer()], marketplaceProgram); // not sure
                let [metadataPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_PREFIX), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintHash.toBuffer()], MPL_TOKEN_METADATA_PROGRAM_ID); // not sure
                let [editionPDA] = PublicKey.findProgramAddressSync([Buffer.from(METADATA_PREFIX), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintHash.toBuffer(), Buffer.from(EDITION_SUFFIX)], MPL_TOKEN_METADATA_PROGRAM_ID); // not sure
                const SYSVAR_INSTRUCTIONS_PUBKEY = new PublicKey("Sysvar1nstructions1111111111111111111111111");
                let newlistAcc = new PublicKey("F4bJKHT7pPffzdHgFGXFwxebka5xxHqdioVgEh1qEN31")
                let auth = new PublicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg")




                console.log("************publicKey", provider.wallet.publicKey.toString());
                console.log("************ownerATA", ownerATA.toString());
                console.log("************listStateAccount", listStateAccount.toString());
                console.log("************listStateATA", listStateATA.toString());
                console.log("************metadataPDA", metadataPDA.toString());
                console.log("************editionPDA", editionPDA.toString());
                console.log("************mintHash", mintHash.toString());



                const tx = await mkt_program.rpc.listLegacy(amount, expireInSec, currency, privateTaker, makerBroker, authorizationData, {
                    accounts: {
                        owner: provider.wallet.publicKey,
                        ownerTa: ownerATA,
                        listState: listStateAccount,
                        listTa: newlistAcc,// not sure
                        mint: mintHash,
                        payer: provider.wallet.publicKey,
                        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: web3.SystemProgram.programId,
                        marketplaceProgram,
                        metadata: metadataPDA,
                        edition: editionPDA,
                        ownerTokenRecord: listStateATA, //not sure
                        listTokenRecord: listStateATA, //not sure
                        authorizationRules: listStateATA, //not sure
                        authorizationRulesProgram: auth,
                        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
                        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                        cosigner: provider.wallet.publicKey,
                    },
                });
                console.log("*****Set Rate Transaction: ", tx);
            }
        } catch (error) {
            console.log("******ERROR", error);
            dispatch(setLoader(false));
        }
    };

    const submitGoldRateMPC = async () => {
        try {
            dispatch(setLoader(true));
            const [vaultPda, _] = PublicKey.findProgramAddressSync(
                [Buffer.from('Account55')],
                programID
            );
            if (isGoldRate) {
                const tx = await program.rpc.globalAccount(new BN(rateGoldToMPC), {
                    accounts: {
                        vault: vaultPda,
                        admin: provider.wallet.publicKey,
                        systemProgram: web3.SystemProgram.programId
                    },
                });
                console.log("*****Set Rate Transaction: ", tx);
            }
            else {
                const tx = await program.rpc.updateGoldValue(new BN(rateGoldToMPC), {
                    accounts: {
                        vault: vaultPda,
                        admin: provider.wallet.publicKey
                    },
                });
                console.log("*****Set Updated Rate Transaction: ", tx);
            }

            await getGoldRate();
            setRateGoldToMPC("");
            toggleGoldRateModal(false);
            dispatch(setLoader(false));
        } catch (error) { console.log("******ERROR", error); dispatch(setLoader(false)); }
    };

    const submitTimeRateMPC = async () => {
        try {
            dispatch(setLoader(true));
            const [valuesPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from('vault03')],
                programID
            );
            if (isTimeRate) {
                const tx = await program.rpc.setCoinsValues(new BN(rateTimeToMPC), {
                    accounts: {
                        values: valuesPDA,
                        admin: provider.wallet.publicKey,
                        systemProgram: web3.SystemProgram.programId
                    },
                });
                console.log("*****Set Rate Transaction: ", tx);
            }
            else {
                const tx = await program.rpc.updateCoinsValues(new BN(rateTimeToMPC), {
                    accounts: {
                        values: valuesPDA,
                        admin: provider.wallet.publicKey,
                        systemProgram: web3.SystemProgram.programId
                    },
                });
                console.log("*****Set Updated Rate Transaction: ", tx);
            }

            await getTimeRate();
            setRateTimeToMPC("");
            toggleTimeRateModal(false);
            dispatch(setLoader(false));
        } catch (error) { console.log("******ERROR", error); dispatch(setLoader(false)); }
    };

    const handleAddTokens = async () => {
        toggleAddTokensModal(true);
    };

    const submitAddTokens = async () => {
        try {
            dispatch(setLoader(true));
            const MPC = new PublicKey("Fp3kdVYE7BiVjkQNtcWHEjhpL5ntpoBiBuRZtT8figTJ");
            const [vaultPda] = PublicKey.findProgramAddressSync([Buffer.from('Account55')], programID);
            const [globalAta] = PublicKey.findProgramAddressSync([Buffer.from("escrowTokenAccount55")], programID);
            const mpcAdminAta = await getAssociatedTokenAddress(MPC, provider.wallet.publicKey);

            const tx = await program.rpc.adminAddMpc(new BN(addTokens), {
                accounts: {
                    escrowAccount: vaultPda,
                    admin: provider.wallet.publicKey,
                    adminTokenAccount: mpcAdminAta,
                    escrowTokenAccount: globalAta,
                    mint: MPC,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                }
            });
            console.log("*****Set Updated Rate Transaction: ", tx);
            await getMPCTokens()
            setAddTokens("")
            toggleAddTokensModal(false);
            dispatch(setLoader(false));
        } catch (error) { console.log("******ERROR", error); dispatch(setLoader(false)); }
    };

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {isLoader ? <Loader /> : null}
                    <ThemeProvider
                        theme={{
                            palette: {
                                primary: {
                                    main: '#A9A9A9',
                                    dark: '#A0A0A0',
                                },
                            },
                        }}
                    >
                        <Box className="swap-container mt-5"
                            sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="current-rate"> <h2>MPC TO GOLD COIN CONVERSION RATE</h2></div>
                            <div className="d-flex justify-content-around align-items-end">
                                <h4 style={{ marginBottom: '0px' }}>1 MPC Tokens = {currentGoldToMpcValue} Gold Coin</h4>
                                <button className="submit-button" onClick={() => toggleGoldRateModal(true)}>Change</button>
                            </div>
                        </Box>
                        <Box className="swap-container mt-5"
                            sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="current-rate"> <h2>MPC TO TIME COIN CONVERSION RATE</h2></div>
                            <div className="d-flex justify-content-around align-items-end">
                                <h4 style={{ marginBottom: '0px' }}>1 MPC Tokens = {currentTimeToMpcValue} Time Coin</h4>
                                <button className="submit-button" onClick={() => toggleTimeRateModal(true)}>Change</button>
                            </div>
                        </Box>
                        <Box className="swap-container mt-5"
                            sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            <div className="current-rate"> <h2>ADD MPC TO HOT WALLETS</h2></div>
                            <div className="d-flex justify-content-around align-items-end">
                                <h4 style={{ marginBottom: '0px' }}>Admin MPC Tokens = {hardWalletTokens} MPC Tokens</h4>
                                <button className="submit-button" onClick={() => handleAddTokens()}>Add</button>
                            </div>
                        </Box>
                    </ThemeProvider>
                    {/* CONVERSION GOLD RATE MODAL */}
                    <Modal isOpen={goldRateModal} toggle={() => { toggleGoldRateModal(false); dispatch(setLoader(false)); }} className="main-modal reward-modal">
                        <ThemeProvider
                            theme={{
                                palette: {
                                    primary: {
                                        main: '#A9A9A9',
                                        dark: '#A0A0A0',
                                    },
                                },
                            }}
                        >
                            <Box sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                            >
                                <ModalHeader toggle={() => { toggleGoldRateModal(false); dispatch(setLoader(false)); }} >
                                    <div className="reward-modal-logo">
                                        <img src={require('../../assets/img/logo.png')} alt="modal-logo" />
                                    </div>
                                    <div className="reward-modal-title"><p>MPC TO GOLD COIN CONVERSION RATE</p></div>
                                    <div className="reward-modal-line"> <hr /></div>
                                </ModalHeader>
                                <ModalBody className="modal-body reward-modal-body">
                                    <div className="row justify-content-center mt-3 mb-4">
                                        <div className="col-md-offset-2 col-md-8 col-sm-12">
                                            <div className="input-group">
                                                <label className='text-white'>{isGoldRate ? 'Set ' : 'Update '} Gold to MPC Token Conversion Rate</label>
                                                <div className="input-group-inline">
                                                    <input
                                                        type="number"
                                                        value={rateGoldToMPC}
                                                        placeholder="Enter the conversion rate"
                                                        onChange={(e) => setRateGoldToMPC(e.target.value)}
                                                    />
                                                </div>
                                                <span style={{ color: '#4d4dff' }}>1 MPC Tokens = {currentGoldToMpcValue} Gold Coin</span>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-2 d-flex justify-content-around">
                                            <button className="submit-button" onClick={() => submit()}>Submit</button>
                                        </div>
                                    </div>
                                </ModalBody>
                            </Box>
                        </ThemeProvider>
                    </Modal>

                    {/* CONVERSION TIME RATE MODAL */}
                    <Modal isOpen={timeRateModal} toggle={() => { toggleTimeRateModal(false); dispatch(setLoader(false)); }} className="main-modal reward-modal">
                        <ThemeProvider
                            theme={{
                                palette: {
                                    primary: {
                                        main: '#A9A9A9',
                                        dark: '#A0A0A0',
                                    },
                                },
                            }}
                        >
                            <Box sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                            >
                                <ModalHeader toggle={() => { toggleTimeRateModal(false); dispatch(setLoader(false)); }}>
                                    <div className="reward-modal-logo">
                                        <img src={require('../../assets/img/logo.png')} alt="modal-logo" />
                                    </div>
                                    <div className="reward-modal-title"><p>MPC TO TIME COIN CONVERSION RATE</p></div>
                                    <div className="reward-modal-line"> <hr /></div>
                                </ModalHeader>
                                <ModalBody className="modal-body reward-modal-body">
                                    <div className="row justify-content-center mt-3 mb-4">
                                        <div className="col-md-offset-2 col-md-8 col-sm-12">
                                            <div className="input-group">
                                                <label className='text-white'>{isTimeRate ? 'Set ' : 'Update '} Time to MPC Token Conversion Rate</label>
                                                <div className="input-group-inline">
                                                    <input
                                                        type="number"
                                                        value={rateTimeToMPC}
                                                        placeholder="Enter the conversion rate"
                                                        onChange={(e) => setRateTimeToMPC(e.target.value)}
                                                    />
                                                </div>
                                                <span style={{ color: '#4d4dff' }}>1 MPC Tokens = {currentTimeToMpcValue} Time Coin</span>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-2 d-flex justify-content-around">
                                            <button className="submit-button" onClick={() => submitTimeRateMPC()}>Submit</button>
                                        </div>
                                    </div>
                                </ModalBody>
                            </Box>
                        </ThemeProvider>
                    </Modal>

                    {/* ADD ADMIN TOKENS MODAL */}
                    <Modal isOpen={addTokensModal} toggle={() => { setAddTokens(""); toggleAddTokensModal(false); dispatch(setLoader(false)); }} className="main-modal reward-modal">
                        <ThemeProvider
                            theme={{
                                palette: {
                                    primary: {
                                        main: '#A9A9A9',
                                        dark: '#A0A0A0',
                                    },
                                },
                            }}
                        >
                            <Box sx={{
                                width: 750,
                                borderRadius: 1,
                                bgcolor: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                            >
                                <ModalHeader toggle={() => { setAddTokens(""); toggleAddTokensModal(false); dispatch(setLoader(false)); }}>
                                    <div className="reward-modal-logo">
                                        <img src={require('../../assets/img/logo.png')} alt="modal-logo" />
                                    </div>
                                    <div className="reward-modal-title"><p>ADD MPC TO HOT WALLETS</p></div>
                                    <div className="reward-modal-line"> <hr /></div>
                                </ModalHeader>
                                <ModalBody className="modal-body reward-modal-body" style={{ paddingBottom: '0px' }}>
                                    <div className="row justify-content-center mt-4 mb-4">
                                        <div className="col-md-offset-2 col-md-8 col-sm-12">
                                            <div className="input-group">
                                                <div className="input-group-inline">
                                                    <input
                                                        type="number"
                                                        value={addTokens}
                                                        onChange={(e) => setAddTokens(e.target.value)}
                                                        placeholder="Enter MPC Tokens"
                                                    />
                                                </div>
                                                <span style={{ color: '#4d4dff' }}>Admin MPC Tokens = {hardWalletTokens} MPC Tokens</span>
                                            </div>
                                            <div className="col-12 mt-2 d-flex justify-content-around">
                                                <button className="submit-button" onClick={() => submitAddTokens()}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                            </Box>
                        </ThemeProvider>
                    </Modal>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default ConversionRate;
