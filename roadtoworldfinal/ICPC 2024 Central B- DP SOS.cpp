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
const int mod = 1e9+7;
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
#define maxn 1200009

/* 
    let fix i1,i2 and count t&a[i3]&a[i4] == 0, i2 <= i3 
    a[i3]&a[i4] la submask cua rev(t)
    dp[mask] la cnt sao cho co nhan mask lam con 
    dp[mask^(1<<i)] -= dp[mask]
   */
int n,k; 
int dp[maxn]; 
int a[maxn]; 
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> k; 
    for (int i = 1; i <= n; i ++) cin >> a[i], dp[a[i]] ++; 
    for (int i = 0; i < 20; i ++)
    {
        for (int mask = (1<<20) - 1; mask >= 0; mask --) if (mask >> i&1) dp[mask^(1<<i)] += dp[mask]; 
    }

    for (int mask = 0; mask < (1<<20); mask ++) dp[mask] = dp[mask]*dp[mask]; 
    for (int i = 0; i < 20; i ++)
    {
        for (int mask = (1<<20) - 1; mask >= 0; mask --) if (mask >> i &1) dp[mask^(1<<i)] -= dp[mask]; 
    }
    
    for (int i = 0; i < 20; i ++)
    {
        for (int mask = 0; mask < (1<<20); mask ++) if (mask >> i&1) dp[mask] += dp[mask^(1<<i)]; 
    }

    for (int i = 1; i <= n; i ++) 
    {
        for (int j = 1; j <= n; j ++) 
        {
            int t = a[i]&a[j]; 
            int rev_t = (1<<20) - 1 - t; 
            if (k <= dp[rev_t]) 
            {
                for (int t1 = 1; t1 <= n; t1 ++) for (int t2 = 1; t2 <= n; t2 ++) 
                {
                    if ((t&a[t1]&a[t2]) == 0) k --; 
                    if (k == 0) 
                    {
                        cout << i << " " << j << " " << t1 << " " << t2; re 
                    }
                }
            }
            else k -= dp[rev_t]; 
        }
    }
    cout << -1;  
    return 0;
}
