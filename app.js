// app.js

// Inisialisasi koneksi ke Ganache melalui MetaMask
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            console.log("Akun terhubung:", accounts[0]);
            alert("Berhasil terhubung dengan akun: " + accounts[0]);
            return accounts[0]; // Return akun yang terhubung
        } catch (error) {
            console.error("Gagal menghubungkan ke MetaMask:", error);
            alert("Gagal menghubungkan ke MetaMask. Coba lagi.");
        }
    } else {
        alert("MetaMask tidak ditemukan. Harap instal MetaMask untuk melanjutkan.");
    }
}

// Fungsi untuk melakukan transaksi pembayaran ke Ganache
async function payWithGanache() {
    const ethAmount = document.getElementById("ethAmount").value;

    if (!ethAmount || ethAmount <= 0) {
        alert("Masukkan jumlah pembayaran yang valid.");
        return;
    }

    try {
        const account = await connectWallet(); // Hubungkan ke MetaMask
        if (!account) return;

        const ganacheAddress = "0xYourGanacheWalletAddressHere"; // Ganti dengan alamat wallet penerima di Ganache

        // Mengatur parameter transaksi
        const transactionParameters = {
            to: ganacheAddress,
            from: account,
            value: ethers.utils.parseUnits(ethAmount, "ether").toHexString(),
            chainId: "1337", // ID chain Ganache (default: 1337)
        };

        // Mengirimkan transaksi
        const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });

        console.log("Transaksi berhasil:", txHash);
        alert("Pembayaran berhasil! Hash transaksi: " + txHash);
    } catch (error) {
        console.error("Pembayaran gagal:", error);
        alert("Pembayaran gagal. Periksa koneksi MetaMask dan Ganache, lalu coba lagi.");
    }
}

// Event Listener untuk tombol pembayaran
document.addEventListener("DOMContentLoaded", () => {
    const payButton = document.getElementById("payButton");
    if (payButton) {
        payButton.addEventListener("click", payWithGanache);
    }
});