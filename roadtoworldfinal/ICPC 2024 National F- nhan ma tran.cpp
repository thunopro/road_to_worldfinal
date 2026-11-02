#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 998244353;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009

struct matrix{
    int a[6][6]; 
    matrix () 
    {
        for (int i = 0; i < 6; i ++) for (int j = 0; j < 6; j ++) a[i][j] = 0; 
    }
    friend matrix operator * (const matrix &A, const matrix &B)
    {
        matrix res; 
        for(int i = 0; i < 6; i ++) for(int j = 0; j < 6; j ++) for (int k = 0; k < 6; k ++) add(res.a[i][j],A.a[i][k]*B.a[k][j]%mod); 
        return res; 
    }
    matrix pw(int n)
    {
        matrix base = *this; 
        matrix res; 
        for (int i = 0; i < 6; i ++) res.a[i][i] = 1; 
        while (n) 
        {
            if (n%2) res = res*base; 
            base = base*base; 
            n /= 2; 
        }
        return res; 
    }
};

int dp[6]; 
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    const int INV = _pow(3,mod-2); 
    dp [0] = 0, dp [1] = dp [2] = dp [3] = 1; 
    for (int i = 4; i <= 5; i ++) 
    {
        for (int j = 3; j <= 5; j ++) add(dp[i],dp[max(0ll,i-j)]); 
        dp[i] = dp[i]*INV%mod; 
        add(dp[i],1); 
    }
    matrix base; 
    base.a[0][2] = base.a[0][3] = base.a[0][4] = INV, base.a[0][5] = 1; 
    base.a[1][0] = base.a[2][1] = base.a[3][2] = base.a[4][3] = base.a[5][5] = 1; 
    vi first5; 
    for (int i = 5; i >= 1; i --) first5.pb(dp[i]); 
    first5.pb(1); 
    vector<matrix> B; 
    matrix cur = base; 
    for (int i = 0; i <= 60; i ++) B.pb(cur), cur = cur*cur; 
    auto solve = [&] (int n)
    {
        vi cur = first5; n-=5; 
        for (int bit = 0; bit <= 60; bit ++) 
        {
            vi new_cur(6,0);
            if (n>>bit&1) 
            {
                for (int i = 0; i < 6; i ++) 
                {
                    int sum = 0; 
                    for (int j = 0; j < 6; j ++) sum += cur[j]*B[bit].a[i][j]; 
                    new_cur[i] = sum%mod; 
                }
                cur = new_cur; 
            }
        }
        return cur[0]; 
    };
    int test; cin >> test; 
    while (test--) 
    {
        int n; cin >> n; 
        int sum = 0; 
        for (int i = 1; i <= n; i ++)
        {
            int x; cin >> x; 
            if (x <= 5) add(sum,dp[x]); 
            else add(sum,solve(x)); 
        }
        cout << sum << "\n"; 
    }
    return 0;
}

/* learn 
   do lifting matrix when do many operation same 
   don't use more add()
   should be use sum over int after that do mod 
*/
