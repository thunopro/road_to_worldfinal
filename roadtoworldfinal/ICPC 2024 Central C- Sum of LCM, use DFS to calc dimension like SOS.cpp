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
int n; 
int p[8] = {2,3,5,7,11,13,17,19}; 

int lim[8],len[8], pw[maxn]; 
int a[maxn][8], big[maxn]; 
vi g,cnt; 
vi group[maxn]; 

void dfs (int bit, int mask, int pos)
{
    if (bit == 8) { cnt[mask] ++; return; }
    for (int i = a[pos][bit]; i <= lim[bit]; i ++) dfs (bit+1,mask+i*len[bit],pos); 
}

int answer; 
void calc (int bit, int mask, int coef) 
{
    if (bit == 8)
    {
        add(answer,coef*g[mask]%mod); 
        return; 
    }
    int power = 1; 
    for (int i = 0; i <= lim[bit]; i ++) 
    {
        int c = power; 
        if (i < lim[bit]) c = (power*(1-p[bit])%mod+mod)%mod; 
        calc(bit+1,mask+i*len[bit],coef*c%mod); 
        power = power*p[bit]%mod; 
    }
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0);
    pw[0] = 1; 
    for (int i = 1; i <= 100; i ++) pw[i] = pw[i-1]*2%mod;
    int test; cin >> test; 
    while (test--)
    {
        cin >> n; 
        for (int i = 0; i <= 500; i ++) group[i].clear(); 
        for (int i = 0; i < 8; i ++) lim[i] = 0; 
        for (int i = 1; i <= n; i ++) for (int j = 0; j < 8; j ++) a[i][j] = 0, big[i] = 0; 
        for (int i = 1; i <= n; i ++) 
        {
            int x; cin >> x; 
            for (int j = 0; j < 8; j ++) 
            {
                while (x % p[j] == 0) x /= p[j], a[i][j] ++; 
                chkmax(lim[j],a[i][j]); 
            }
            if (x > 1) big[i] = x; else big[i] = 0; 
            group[big[i]].pb(i); 
        }

        len [0] = 1;  
        for (int i = 1; i < 8; i ++) len[i] = len[i-1]*(lim[i-1]+1);

        int full_mask = len[7]*(lim[7]+1); 
        g.assign(full_mask,1); 
        cnt.resize(full_mask); 

        for (int p = 0; p <= 500; p ++) 
        {
            if (group[p].empty()) continue; 
            fill(cnt.begin(),cnt.end(),0); 

            for (auto x : group[p]) dfs(0,0,x); 
            for (int mask = 0; mask < full_mask ; mask ++) 
            {
                int w = pw[cnt[mask]]; 
                if (p) w = (1+p*(w-1))%mod; 
                g[mask] = g[mask]*w%mod;
            }
        }

        answer = 0; 
        calc(0,0,1); 
        add(answer,-1);
        cout << answer << "\n"; 
    }
    return 0;
}
