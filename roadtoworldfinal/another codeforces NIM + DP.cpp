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
#define maxn 200009

int dp[33][6][2][2],ndp[33][6][2][2]; 
vi getcnt (int a, int b) 
{
    memset(dp,0,sizeof dp); 
    dp[0][0][0][0] = 1; 
    for (int bit = 29; bit >= 0; bit --) 
    {
        memset (ndp,0,sizeof ndp); 
        int abit = (a>>bit&1), bbit = (b>>bit&1); 
        for (int k = 0; k < 30; k ++) for (int type = 0; type < 6; type ++) for (int good = 0; good < 2; good ++) for (int low = 0; low < 2; low ++) 
        {
            int ways = dp[k][type][good][low]; 
            if (!ways) continue; 
            add(ndp[k][type][good|abit][low|bbit],ways); 
            if (!low && !bbit) continue; 
            int v = good | abit; 
            int new_k = (type == 0 ? 0 : k+1); 
            int new_type; 
            if (v) 
            {
                if (type == 0) new_type = 1; 
                else if (type == 1 || type == 2) new_type = 2; 
                else new_type = 5; 
            }
            else 
            {
                if (type == 0) new_type = 0; 
                else if (type == 1 || type == 4) new_type = 4; 
                else if (type == 2) new_type = 3; 
                else new_type = 5; 
            }
            add(ndp[new_k][new_type][good][low],ways); 
        }
        memcpy(dp,ndp,sizeof dp); 
    }
    vi cnt(32,0); 
    for (int k = 0; k < 30; k ++) for (int good = 0; good < 2; good ++) for (int low = 0; low < 2; low ++) for (int type = 0; type < 6; type ++) 
    {
        int grundy = 0; 
        if (type == 1) grundy = 1; 
        else if (type == 2 || type == 5) grundy = k+1; 
        else if (type == 4) grundy = k+(k%2?-1 : 1); 
        add(cnt[grundy],dp[k][type][good][low]); 
    }
    add(cnt[0],-1); 
    return cnt; 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    int test; cin >> test; 
    while (test--) 
    {
        int n; cin >> n; 
        int a[n+1], b[n+1]; 
        for (int i = 1; i <= n; i ++) cin >> a[i]; 
        for (int i = 1; i <= n; i ++) cin >> b[i]; 
        vi f(32,0); 
        f[0] = 1; 
        for (int t = 1; t <= n; t ++) 
        {
            vi cnt = getcnt(a[t],b[t]); 
            vi nf(32,0); 
            for (int i = 0; i < 32; i ++) for (int j = 0; j < 32; j ++) add(nf[i^j],f[i]*cnt[j]%mod); 
            f = nf; 
        }
        cout << f[0] << "\n"; 
    }
    return 0;
}
