#include<bits/stdc++.h>
using namespace std; 
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
#define TIME ( 1.0*clock() / CLOCKS_PER_SEC )
const int mod = 1e9+7;
const int INF = 1e9; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T > void chkmin ( T &a , T b ) { if ( a > b ) a = b ; } 
template <typename T > void chkmax ( T &a , T b ) { if ( a < b ) a = b ; } 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow (int a , int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009

struct shape
{
    int r,x,y,id; 
}; 

struct Fenwick2D{
    int n; 
    vector<vi> ys, bit; 
    Fenwick2D (int n) : n(n), ys(n+1), bit(n+1){}

    void prepare(int x, int y) 
    {
        while (x <= n) ys[x].pb(y), x += (x&-x); 
    }
    void build() 
    {
        for (int i = 1; i <= n; i ++) 
        {
            auto &v = ys[i]; 
            sort (v.begin(),v.end()); v.resize(unique(v.begin(),v.end())-v.begin()); 
            bit[i].assign(v.size() +1, INF); 
        }
    }
    void update (int x, int y, int w) 
    {
        for (int i = x; i <= n; i += (i&-i)) 
        {
            int j = lower_bound(ys[i].begin(),ys[i].end(),y) - ys[i].begin() + 1; 
            for (; j < (int)bit[i].size(); j += (j&-j)) 
            {
                bit[i][j] = min(bit[i][j],w); 
            }
        }
    }
    int query (int x, int y) 
    {
        int res = INF; 
        for (int i = x; i ; i -= (i&-i)) 
        {
            int j = lower_bound(ys[i].begin(),ys[i].end(),y) - ys[i].begin(); 
            for (; j > 0; j -= (j&-j)) chkmin(res,bit[i][j]); 
        }
        return res; 
    }
};

int n; 
int a[maxn]; 
int cnt[4]; 
int other[4];
shape p[maxn]; 
void solve (int mode) 
{
    for (int i = 0; i < 4; i ++) cnt[i] = 0; 
    int answer = 0; 
    int num_other = 0; 
    for (int i = 0; i < 4; i ++) if (i != mode) other[num_other++] = i; 
    
    p[0] = {0,0,0,0}; 
    for (int i = 1; i <= n; i ++) 
    {
        cnt[a[i]] ++; 
        p[i] = {cnt[mode]-cnt[other[0]],cnt[mode]-cnt[other[1]],cnt[mode]-cnt[other[2]],i}; 
    }

    vi v; 
    for (int i = 0; i <= n; i ++) v.pb(p[i].x);
    sort (v.begin(),v.end()); v.resize(unique(v.begin(),v.end())-v.begin()); 
    Fenwick2D ft(v.size()); 
    for (int i = 0; i <= n; i ++) 
    {
        p[i].x = lower_bound(v.begin(),v.end(),p[i].x) - v.begin() + 1; 
        ft.prepare(p[i].x,p[i].y); 
    }

    ft.build(); 
    sort (p,p+n+1,[&] (shape A, shape B){ return A.r < B.r;}); 

    int res = 0; 
    
    int l = 0; 
    while (true) 
    {
        int r = l; 
        while (r+1 <= n && p[r+1].r == p[l].r) r ++; 
        for (int i = l; i <= r; i ++) 
        {
            int j = ft.query(p[i].x-1,p[i].y); 
            if (j < p[i].id) chkmax(answer,p[i].id - j);
        }
        for (int i = l; i <= r; i ++) ft.update(p[i].x,p[i].y,p[i].id); 
        l = r+1; 
        if (l > n) break; 
    }
    cout << answer << " "; 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n;
    for (int i = 1; i <= n; i ++) cin >> a[i]; 
    for (int i = 0; i < 4; i ++) solve(i);
    return 0;
}
