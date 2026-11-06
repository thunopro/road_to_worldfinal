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
#define maxn 300009

int n,nq; 
struct shape{
    int l,r,ch; 
    bool operator < (const shape &other) const 
    {
        if (l != other.l) return l < other.l; 
        if (r != other.r) return r < other.r; 
        return ch < other.ch; 
    }
}; 
set <shape> S; 

struct BIT{
    int n; 
    vi bit; 
    BIT (int _n) { n = _n; bit.resize(n+1);}
    void update (int x, int w) 
    {
        while (x) bit [x] += w, x -= (x&-x); 
    }
    int get (int x) 
    {
        int res = 0; 
        while (x <= n) res += bit[x], x += (x&-x); 
        return res; 
    }
}sum(maxn), cnt(maxn);

void update (int l, int r, int ch) 
{
    auto it = S.upper_bound({l,0,ch});
    if (it != S.begin()) it --;
    vector<shape> Erase; 
    vector<shape> Insert; 
    while (true) 
    {
        if (it == S.end()) break; 
        auto [u,v,c] = *it;  
        if (u >= l && v <= r) Erase.pb({u,v,c}); 
        else if (u < l) 
        {
            if (c != ch) 
            {
                Erase.pb({u,v,c}), Insert.pb({u,l-1,c});
                if (v > r) Insert.pb({r+1,v,c}); 
            }
            else if (c == ch) Erase.pb({u,v,c}), chkmin(l,u),chkmax(r,v); 
        }
        else if (v > r)     
        {
            if (u > r+1) break; 
            if (c != ch) 
            {
                Erase.pb({u,v,c}), Insert.pb({r+1,v,c}); 
            }
            else if (c == ch) 
            {
                Erase.pb({u,v,c}); 
                chkmin(l,u), chkmax(r,v); 
            }
        }
        it ++; 
    }
    Insert.pb({l,r,ch}); 
    for (auto [l,r,ch] : Erase) 
    {
        if (l > r) continue; 
        S.erase({l,r,ch}); 
        int len = r-l+1; 
        sum.update(len,-len), cnt.update(len,-1); 
    }
    for (auto [l,r,ch] : Insert) 
    {
        if (l > r) continue; 
        S.insert({l,r,ch}); 
        int len = r-l+1; 
        sum.update(len,len), cnt.update(len,1); 
    }
}
 
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> nq; 
    S.insert({1,n,0}); 

    sum.update(n,n); cnt.update(n,1);

    while (nq --) 
    {
        int type; cin >> type; 
        if (type == 1) 
        {
            int l,r; char c; int ch; cin >> l >> r >> c; ch = c -'A', l ++, r ++;  
            update(l,r,ch); 
        }
        else
        {
            int k; cin >> k; 
            cout << sum.get(k) - cnt.get(k)*k << "\n"; 
        }
    }
    return 0;
}
